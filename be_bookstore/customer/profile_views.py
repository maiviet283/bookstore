from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import transaction, IntegrityError
from django.contrib.auth.hashers import check_password, make_password
from django.core.cache import caches

from core.db_exceptions import handle_integrity_error
from core.auth_customer import CustomJWTAuthentication
from core.responses import success_response, error_response
from customer.serializers import CustomerProfileSerializer, CustomerUpdateSerializer
from .models import Customer

from core.log_queries import log_queries

cache = caches['default']


class InforCustomer(APIView):
    """
        Lấy thông tin người dùng hiện tại, 
        Chỉ 1 truy vấn cơ sở dữ liệu, 
        Loại bỏ các trường nhạy cảm (password, is_active, is_delete)
        Thời gian 15-25 ms
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    def get(self, request):
        cache_key = f'customer_{request.user.id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return success_response(
                "Lấy Thông Tin của Quý Khách Thành Công (Cache)",
                data=cached_data
            )
        
        user = (
            Customer.objects
            .defer('password', "is_active", "is_delete")
            .get(id=request.user.id)
        )
        
        serializer = CustomerProfileSerializer(user)
        data = serializer.data
        cache.set(cache_key, data, timeout=600)

        return success_response(
            "Lấy Thông Tin của Quý Khách Thành Công (DB)",
            data=serializer.data
        )


class UpdateCustomer(APIView):
    """
        Cập nhật thông tin Customer Tốn 5 truy vấn 
        - Một SELECT kiểm tra user tồn tại và active, 
        - Một UPDATE cập nhật các trường được gửi, 
        - Một COMMIT để hoàn tất transaction. 
        - Thời gian 50-150ms
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    @transaction.atomic
    def patch(self, request):
        try:
            customer = Customer.objects.get(id=request.user.id, is_active=True)
            serializer = CustomerUpdateSerializer(customer, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        except IntegrityError as e:
            err_info = handle_integrity_error(e)
            return error_response(err_info["message"], errors=err_info["errors"])
        except Customer.DoesNotExist:
            return error_response("Không tìm thấy khách hàng.", http_status=status.HTTP_404_NOT_FOUND)

        cache.delete(f'customer_{request.user.id}')

        return success_response("Cập nhật thông tin khách hàng thành công")


class UpdatePasswordCustomer(APIView):
    """
        Tốn 2 truy vấn
        thời gian : 500ms - 2s
        thời gian quá nhiều do mã hoá mật khẩu
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    def patch(self, request):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return error_response("Vui lòng điền đầy đủ old_password và new_password")

        if len(new_password) < 8:
            return error_response("Mật khẩu mới phải có ít nhất 8 ký tự")

        user_pw = Customer.objects.filter(id=request.user.id).values_list("password", flat=True).first()
        if not user_pw or not check_password(old_password, user_pw):
            return error_response("Mật khẩu cũ không đúng")

        new_password = make_password(new_password)
        Customer.objects.filter(id=request.user.id).update(password=new_password)

        return success_response("Đổi mật khẩu thành công")
