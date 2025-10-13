from django.db import connection, reset_queries
from django.conf import settings
from functools import wraps
import traceback

def log_queries(func):
    """
    Decorator để log số truy vấn SQL thực hiện trong một request/view.
    
    Chỉ hoạt động khi `settings.DEBUG=True`.
    - Reset queries trước khi gọi hàm.
    - Gọi view.
    - Log tổng số truy vấn và chi tiết nếu cần.
    - Nếu view bị lỗi, vẫn log số truy vấn trước khi raise exception.
    
    Sử dụng:
        @log_queries
        def post(self, request):
            ...
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        if settings.DEBUG:
            reset_queries()
        try:
            response = func(*args, **kwargs)
        except Exception as e:
            if settings.DEBUG:
                total_queries = len(connection.queries)
                print(f"Exception xảy ra! Tổng số truy vấn trước khi lỗi: {total_queries}")
                print(traceback.format_exc())
            raise 
        if settings.DEBUG:
            total_queries = len(connection.queries)
            print(f"Tổng số truy vấn SQL thực hiện: {total_queries}")
        return response
    return wrapper
