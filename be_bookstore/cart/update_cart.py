from django.db import transaction
from django.db.models import F, Sum
from django.core.cache import caches
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import Cart, CartItem
from book.models import Book
from core.auth_customer import CustomJWTAuthentication
from core.log_queries import log_queries
from core.responses import success_response, error_response

cache = caches['data_cart_cache']


class UpdateCartAPI(APIView):
    """
        API Thêm / Sửa / Xoá sản phẩm trong giỏ hàng (thông qua URL params)
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
                return error_response(
                    message="Hành động không hợp lệ",
                    http_status=400
                )

            cache.delete(f"cart_info_{user_id}")

            cart, _ = Cart.objects.only("id", "total_amount").get_or_create(
                customer_id=user_id,
                defaults={"status": "active", "total_amount": 0}
            )

            # Xóa toàn bộ giỏ hàng
            if action == "clear":
                CartItem.objects.filter(cart_id=cart.id).delete()
                cart.total_amount = 0
                cart.save(update_fields=["total_amount"])
                return success_response(message="Đã xoá toàn bộ giỏ hàng")

            # Kiểm tra sách tồn tại
            book = Book.objects.only("id", "price", "stock").filter(
                id=book_id, is_delete=False
            ).first()
            if not book:
                return error_response(message="Sách không tồn tại", http_status=404)

            # Kiểm tra cart item
            cart_item = CartItem.objects.filter(
                cart_id=cart.id, book_id=book.id
            ).only("id", "quantity").first()

            # Thêm sản phẩm
            if action == "add":
                if cart_item:
                    if cart_item.quantity + quantity > book.stock:
                        return error_response(message="Vượt quá tồn kho")
                    cart_item.quantity = F("quantity") + quantity
                    cart_item.save(update_fields=["quantity"])
                else:
                    CartItem.objects.create(
                        cart_id=cart.id,
                        book_id=book.id,
                        quantity=min(quantity, book.stock),
                        price_at_time=book.price,
                    )

            # Xoá sản phẩm
            elif action == "remove":
                if not cart_item:
                    return error_response(message="Sách chưa có trong giỏ")

                if cart_item.quantity <= quantity:
                    CartItem.objects.filter(id=cart_item.id).delete()
                else:
                    CartItem.objects.filter(id=cart_item.id).update(
                        quantity=F("quantity") - quantity
                    )

            # Set số lượng
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

            return success_response(
                message="Cập nhật giỏ hàng thành công",
                data={"total": float(total)}
            )

        except ValueError:
            return error_response(message="Số lượng không hợp lệ")

        except Exception as e:
            transaction.set_rollback(True)
            return error_response(
                message=f"Lỗi hệ thống: {str(e)}",
                http_status=500
            )
