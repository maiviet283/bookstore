from django.db import transaction
from django.db.models import F, Sum
from django.core.cache import caches
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Cart, CartItem
from book.models import Book
from core.auth_customer import CustomJWTAuthentication
from core.log_queries import log_queries

cache = caches['data_cart_cache']


class UpdateCartAPI(APIView):
    """
        API Thêm Sửa Xoá sản phẩm trong giỏ hàng, các params sẽ được điền trên URL
        - add: 13 truy vấn, 50-120ms
        - remove: 13 truy vấn, 50-90ms
        - clear: 5 truy vấn, 17-70ms
        - set: 13 truy vấn, 65-130ms
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    @transaction.atomic
    def post(self, request, book_id):
        try:
            action = request.query_params.get("action")
            quantity = int(request.data.get("quantity", 1))
            user_id = request.user.id

            if action not in ["add", "remove", "set", "clear"]:
                return Response(
                    {"status": "error", "message": "Hành động không hợp lệ"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cache.delete(f"cart_info_{user_id}")

            cart, _ = Cart.objects.only("id", "total_amount").get_or_create(
                customer_id=user_id,
                defaults={"status": "active", "total_amount": 0}
            )

            if action == "clear":
                CartItem.objects.filter(cart_id=cart.id).delete()
                cart.total_amount = 0
                cart.save(update_fields=["total_amount"])
                return Response(
                    {"status": "success", "message": "Đã xoá toàn bộ giỏ hàng"},
                    status=status.HTTP_200_OK
                )

            book = Book.objects.only("id", "price", "stock").filter(
                id=book_id, is_delete=False
            ).first()
            if not book:
                return Response(
                    {"status": "error", "message": "Sách không tồn tại"},
                    status=status.HTTP_404_NOT_FOUND
                )

            cart_item = CartItem.objects.filter(
                cart_id=cart.id, book_id=book.id
            ).only("id", "quantity").first()

            if action == "add":
                if cart_item:
                    if cart_item.quantity + quantity > book.stock:
                        return Response(
                            {"status": "error", "message": "Vượt quá tồn kho"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    cart_item.quantity = F("quantity") + quantity
                    cart_item.save(update_fields=["quantity"])
                else:
                    CartItem.objects.create(
                        cart_id=cart.id,
                        book_id=book.id,
                        quantity=min(quantity, book.stock),
                        price_at_time=book.price,
                    )

            elif action == "remove":
                if not cart_item:
                    return Response(
                        {"status": "error", "message": "Sách chưa có trong giỏ"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    if cart_item.quantity <= quantity:
                        cart_item.delete()
                        cart_item = None
                    else:
                        cart_item.quantity = F("quantity") - quantity
                        cart_item.save(update_fields=["quantity"])

                except Exception as e:
                    transaction.set_rollback(True)
                    return Response(
                        {"status": "error", "message": f"Sách Không tồn tại trong giỏ hàng"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            elif action == "set":
                if quantity <= 0:
                    if cart_item:
                        cart_item.delete()
                else:
                    if cart_item:
                        cart_item.quantity = min(quantity, book.stock)
                        cart_item.save(update_fields=["quantity"])
                    else:
                        CartItem.objects.create(
                            cart_id=cart.id,
                            book_id=book.id,
                            quantity=min(quantity, book.stock),
                            price_at_time=book.price,
                        )

            total = CartItem.objects.filter(cart_id=cart.id).aggregate(
                total=Sum(F("quantity") * F("price_at_time"))
            )["total"] or 0

            Cart.objects.filter(id=cart.id).update(total_amount=total)

            return Response(
                {"status": "success", "total": float(total)},
                status=status.HTTP_200_OK
            )

        except ValueError:
            return Response(
                {"status": "error", "message": "Số lượng không hợp lệ"},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            transaction.set_rollback(True)
            return Response(
                {"status": "error", "message": f"Lỗi hệ thống: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
