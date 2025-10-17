from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.cache import caches
from django.db.models import Count, Prefetch

from core.auth_customer import CustomJWTAuthentication
from core.email_service import send_order_confirmation_email
from order.utils import create_order_from_cart
from core.log_queries import log_queries
from .serializer import OrderSerializer
from cart.models import Cart
from .models import Order, OrderItem

cache = caches['data_cart_cache']


class OrderListAPIView(APIView):
    """
        API Lấy danh sách đơn hàng
        - Tốn 2 truy vấn db vì dùng prefetch_related
        - Thời gian: 50ms
    """
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @log_queries
    def get(self, request):
        customer_id = request.user.id
        cache_key = f'order_info_{customer_id}'
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response({
                "status": "success",
                "message": "Lấy danh sách đơn hàng thành công (Cache)",
                "data": cached_data
            }, status=status.HTTP_200_OK)

        orders = (
            Order.objects
            .filter(customer_id=customer_id)
            .annotate(item_count=Count('items'))
            .prefetch_related(
                Prefetch(
                    'items',
                    queryset=OrderItem.objects.select_related('book').only(
                        'id', 'book', 'book__name', 'price', 'quantity', 
                        'subtotal', 'book_title', 'order_id'
                    )
                )
            )
            .only('id', 'order_code', 'status', 'payment_method', 'total_amount', 'created_at')
        )

        serializer = OrderSerializer(orders, many=True)
        data = serializer.data

        cache.set(cache_key, data, timeout=300)

        return Response({
            "status": "success",
            "message": "Lấy danh sách đơn hàng thành công (DB)",
            "data": data
        }, status=status.HTTP_200_OK)


class CreateOrderAPIView(APIView):
    """
        API tạo đơn hàng từ giỏ hàng hiện tại.
        - Cần 3 đối số truyền vào (shipping_address, payment_method và note)
        - Tốn 9 Truy vấn
        - Thời gian khoảng 70ms
    """
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @log_queries
    def post(self, request):
        customer = request.user
        data = request.data
        
        cache.delete(f'cart_info_{customer.id}')
        cache.delete(f'order_info_{customer.id}')

        shipping_address = data.get('shipping_address')
        payment_method = data.get('payment_method', 'cod')
        note = data.get('note', '')

        if not shipping_address:
            return Response({
                "message": "Vui lòng nhập địa chỉ giao hàng."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = customer.cart
        except Cart.DoesNotExist:
            return Response({
                "message": "Không tìm thấy giỏ hàng của bạn."
            }, status=status.HTTP_404_NOT_FOUND)

        if not cart.items.exists():
            return Response({
                "message": "Giỏ hàng của bạn đang trống."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = create_order_from_cart(
                cart=cart,
                payment_method=payment_method,
                shipping_address=shipping_address,
                note=note
            )
            send_order_confirmation_email(customer, order)
            
        except ValueError as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "message": f"Lỗi khi tạo đơn hàng: {e}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "Tạo đơn hàng thành công!",
            "order_code": order.order_code,
            "total_amount": float(order.total_amount),
            "status": order.status,
            "payment_method": order.payment_method,
            "created_at": order.created_at,
        }, status=status.HTTP_201_CREATED)
