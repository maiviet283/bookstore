import logging
import traceback
from django.http import JsonResponse

logger = logging.getLogger("bookstore")


class GlobalExceptionMiddleware:
    """
        Middleware bảo vệ server khỏi crash do lỗi runtime.
        Log lại chi tiết stacktrace để debug.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            return response
        except Exception as e:
            tb = traceback.format_exc()
            logger.error(f"Lỗi nghiêm trọng: {e}\n{tb}", exc_info=True)

            return JsonResponse({
                "status": "error",
                "message": "Máy chủ đang gặp sự cố, vui lòng thử lại sau.",
                "code": "server_crash_protection",
            }, status=500)
