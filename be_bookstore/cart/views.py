from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Prefetch
from django.core.cache import caches

from core.auth_customer import CustomJWTAuthentication
from .serializers import CartSerializer
from .models import Cart, CartItem
from core.log_queries import log_queries
from core.responses import success_response, error_response

cache = caches['data_cart_cache']


class CartListAPIView(APIView):
    """
        API hiển thị giỏ hàng hiện tại của khách hàng
        - Tốn 2 truy vấn vì sử dụng prefetch_related (1 chính, 1 phụ)
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
                return success_response(
                    message="Lấy giỏ hàng thành công (Cache)",
                    data=cached_data
                )

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
                return error_response(
                    message="Không tìm thấy giỏ hàng hoạt động",
                    http_status=404
                )

            serializer = CartSerializer(cart, context={"request": request})
            data = serializer.data
            cache.set(cache_key, data, timeout=600)

            return success_response(
                message="Lấy giỏ hàng thành công (DB)",
                data=data
            )

        except Exception:
            return error_response(
                message="Đã xảy ra lỗi khi lấy giỏ hàng",
                http_status=500
            )
