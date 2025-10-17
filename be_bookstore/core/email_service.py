import threading
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings


def send_order_confirmation_email(user, order):
    """
    Gửi email xác nhận đơn hàng cho khách hàng (chạy ngầm).
    """
    if not user.email:
        return 

    subject = f"Xác nhận đơn hàng #{order.order_code}"
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]

    context = {
        "user": user,
        "order": order,
        "items": order.items.all(),
    }

    message = render_to_string("emails/order_confirmation.html", context)

    def _send():
        send_mail(
            subject=subject,
            message="",
            from_email=from_email,
            recipient_list=recipient_list,
            html_message=message,
            fail_silently=True,
        )

    threading.Thread(target=_send, daemon=True).start()
