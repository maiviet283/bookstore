from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated

def custom_exception_handler(exc, context):
    """
    Custom Exception Handler — Xử lý lỗi toàn cục cho Django REST Framework.

    Các lỗi được xử lý:
    1. 405 Method Not Allowed → trả về JSON chuẩn với method.
    2. 401 Not Authenticated → không có token hoặc chưa đăng nhập.
    3. 401 Authentication Failed → token hết hạn hoặc không hợp lệ.
    4. Các lỗi khác → trả về response mặc định DRF.
    """
    try:
        # Gọi exception handler mặc định của DRF
        response = exception_handler(exc, context)

        # Lỗi Method Not Allowed
        if response is not None and response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
            method = getattr(context.get("request"), "method", "UNKNOWN")
            response.data = {
                "status": "error",
                "message": f"Phương thức {method} không được phép tại endpoint này",
                "code": "method_not_allowed"
            }
            return response

        # Lỗi chưa có credentials
        if isinstance(exc, NotAuthenticated):
            return Response(
                {
                    "status": "error",
                    "message": "Bạn cần đăng nhập để thực hiện hành động này",
                    "code": "authentication_required"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Lỗi token không hợp lệ hoặc hết hạn
        if isinstance(exc, AuthenticationFailed):
            return Response(
                {
                    "status": "error",
                    "message": "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
                    "code": "invalid_or_expired_token"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Trả về response mặc định nếu không phải các trường hợp trên
        return response

    except Exception as e:
        # Bắt các lỗi bất ngờ trong quá trình xử lý ngoại lệ
        return Response({
            "status": "error",
            "message": f"Lỗi nội bộ khi xử lý ngoại lệ: {str(e)}",
            "code": "internal_exception_handler_error"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
