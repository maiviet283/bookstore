from .models import Order, OrderItem
from django.db import transaction


def create_order_from_cart(cart, payment_method='cod', shipping_address='', note=''):
    """Tạo đơn hàng từ giỏ hàng hiện tại (phiên bản tối ưu)"""
    cart_items = list(cart.items.select_related('book'))
    if not cart_items:
        raise ValueError("Giỏ hàng trống, không thể tạo đơn hàng.")

    with transaction.atomic():
        order = Order.objects.create(
            customer=cart.customer,
            payment_method=payment_method,
            shipping_address=shipping_address,
            note=note,
            total_amount=cart.total_amount
        )

        order_items = [
            OrderItem(
                order=order,
                book=item.book,
                book_title=item.book.name,
                price=item.price_at_time,
                quantity=item.quantity,
                subtotal=item.subtotal
            )
            for item in cart_items
        ]

        OrderItem.objects.bulk_create(order_items)

        cart.items.all().delete()

        cart.total_amount = 0
        cart.save(update_fields=['total_amount'])
        return order
