from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import  Prefetch
from django.core.cache import caches

from core.auth_customer import CustomJWTAuthentication
from .serializers import CartSerializer
from .models import Cart, CartItem

from core.log_queries import log_queries


cache = caches['data_cart_cache']

class CartListAPIView(APIView):
    """
        API hiển thị giỏ hàng hiện tại của khách hàng
        - Tốn 2 Truy vấn vì sử dụng prefetch_related (1 Chính và 1 Phụ)
        - Thời gian: 30-60ms
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    def get(self, request):
        try:
            user_id = request.user.id
            cache_key = f"cart_info_{user_id}"
            cached_data = cache.get(cache_key)
            
            if cached_data:
                return Response({
                        "status": "success",
                        "message": "Lấy giỏ hàng thành công (Cache)",
                        "data": cached_data,
                    },status=status.HTTP_200_OK)

            cart = (
                Cart.objects
                .only("id", "status", "total_amount")
                .prefetch_related(
                    Prefetch(
                        "items",
                        queryset=CartItem.objects.select_related("book").only(
                            "id", "cart", "book__id", "book__name",
                            "book__image", "book__price", "quantity", "price_at_time"
                        ),
                    )
                )
                .filter(customer=user_id, status="active")
                .first()
            )

            if not cart:
                return Response({
                    "status": "error", "message": "Không tìm thấy giỏ hàng hoạt động"
                    },status=status.HTTP_404_NOT_FOUND,)

            serializer = CartSerializer(cart, context={"request": request})
            data = serializer.data
            cache.set(cache_key, data, timeout=600)

            return Response({
                    "status": "success",
                    "message": "Lấy giỏ hàng thành công (DB)",
                    "data": data,
                },status=status.HTTP_200_OK)

        except Exception:
            return Response({
                    "status": "error",
                    "message": "Đã xảy ra lỗi khi lấy giỏ hàng",
                },status=status.HTTP_500_INTERNAL_SERVER_ERROR)
