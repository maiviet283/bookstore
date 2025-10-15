from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.db.models import Q, Count, Prefetch
from django.db import IntegrityError, DatabaseError, transaction
from django.shortcuts import get_object_or_404

from core.db_exceptions import handle_integrity_error
from core.auth_customer import CustomJWTAuthentication
from core.tokens import CustomerRefreshToken
from customer.models import Customer
from book.models import Book
from .models import Cart, CartItem


from core.log_queries import log_queries

class CartListAPIView(APIView):
    """
    Lấy giỏ hàng hiện tại của khách hàng (đã đăng nhập)
    - Không tính lại tổng tiền vì Cart.total_amount đã lưu sẵn trong DB
    - Tối ưu truy vấn bằng only() và prefetch_related()
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    def get(self, request):
        user_id = request.user.id

        cart = (
            Cart.objects
            .only("id", "status", "total_amount")
            .prefetch_related(
                Prefetch(
                    "items",
                    queryset=CartItem.objects.select_related("book").only(
                        "id", "cart", "book__id", "book__name", "book__price", "quantity", "price_at_time"
                    ),
                )
            )
            .filter(customer=user_id, status="active")
            .first()
        )

        if not cart:
            return Response(
                {"status": "error", "message": "Không tìm thấy giỏ hàng hoạt động"},
                status=status.HTTP_404_NOT_FOUND,
            )

        items_data = [
            {
                "id": item.id,
                "book_id": item.book.id,
                "book_name": item.book.name,
                "book_price": float(item.book.price),
                "quantity": item.quantity,
                "price_at_time": float(item.price_at_time),
            }
            for item in cart.items.all()
        ]

        return Response(
            {
                "status": "success",
                "message": "Lấy giỏ hàng thành công",
                "data": {
                    "cart_id": cart.id,
                    "status": cart.status,
                    "total_amount": float(cart.total_amount),
                    "items": items_data,
                },
            },
            status=status.HTTP_200_OK,
        )


class AddBookToCart(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    @transaction.atomic
    def post(self, request, book_id):
        user_id = request.user.id
        quantity = int(request.data.get("quantity", 1))

        if quantity <= 0:
            return Response(
                {"status": "error", "message": "Số lượng không hợp lệ"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Lấy customer và cart (nếu không có thì trả lỗi)
        customer = get_object_or_404(Customer, id=user_id)
        cart = getattr(customer, "cart", None)

        if not cart or cart.status != "active":
            return Response(
                {"status": "error", "message": "Không tìm thấy giỏ hàng đang hoạt động"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Lấy book
        book = get_object_or_404(Book, id=book_id)

        # Cập nhật hoặc thêm mới sản phẩm
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            book=book,
            defaults={"quantity": quantity, "price_at_time": book.price},
        )

        if not created:
            # Cập nhật trực tiếp trong DB (không cần load lại object)
            CartItem.objects.filter(id=cart_item.id).update(
                quantity=cart_item.quantity + quantity
            )

        return Response(
            {"status": "success", "message": "Thêm sản phẩm vào giỏ hàng thành công"},
            status=status.HTTP_200_OK,
        )