from django.http import JsonResponse
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated
from django.http import Http404
from django.urls.exceptions import Resolver404


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, (Http404, Resolver404)):
        return Response({
            "status": "error",
            "message": "URL API không tồn tại hoặc không hợp lệ.",
            "code": "not_found",
        }, status=status.HTTP_404_NOT_FOUND)

    if response is not None and response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
        method = getattr(context.get("request"), "method", "UNKNOWN")
        response.data = {
            "status": "error",
            "message": f"Phương thức {method} không được phép tại endpoint này.",
            "code": "method_not_allowed",
        }
        return response

    if isinstance(exc, NotAuthenticated):
        return Response({
            "status": "error",
            "message": "Bạn cần đăng nhập để thực hiện hành động này.",
            "code": "authentication_required"
        }, status=status.HTTP_401_UNAUTHORIZED)

    if isinstance(exc, AuthenticationFailed):
        return Response({
            "status": "error",
            "message": "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
            "code": "invalid_or_expired_token"
        }, status=status.HTTP_401_UNAUTHORIZED)

    if response is not None:
        return response

    return Response({
        "status": "error",
        "message": "Lỗi không xác định từ máy chủ.",
        "code": "internal_server_error"
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def custom_404_handler(request, exception=None):
    return JsonResponse({
        "status": "error",
        "message": "URL API không tồn tại hoặc không hợp lệ.",
        "code": "not_found"
    }, status=404)
