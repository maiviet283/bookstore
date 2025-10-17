from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from order.models import Order

@api_view(["GET"])
def vnqr_payment(request, order_code):
    """
        Trả về thông tin QR thanh toán VietQR theo mã đơn hàng
    """
    try:
        order = Order.objects.only("order_code", "total_amount").get(order_code=order_code)
    except Order.DoesNotExist:
        return Response(
            {"message": "Không tìm thấy đơn hàng."},
            status=status.HTTP_404_NOT_FOUND
        )

    bank = settings.BANK_INFO["code"]
    account = settings.BANK_INFO["account"]
    account_name = settings.BANK_INFO["account_name"]
    bank_name = settings.BANK_INFO["name"]

    note = f"ORDER_{order.order_code}"
    qr_url = (
        f"https://img.vietqr.io/image/{bank}-{account}-compact2.png"
        f"?amount={int(order.total_amount)}&addInfo={note}"
    )

    return Response(
        {
            "message": "Tạo QR thanh toán thành công",
            "data": {
                "order_code": order.order_code,
                "amount": int(order.total_amount),
                "bank_code": bank,
                "bank_name": bank_name,
                "account_number": account,
                "account_name": account_name,
                "note": note,
                "qr_image_url": qr_url,
            },
        },
        status=status.HTTP_200_OK,
    )
