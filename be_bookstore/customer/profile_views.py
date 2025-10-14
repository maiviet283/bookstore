from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction, IntegrityError
from django.contrib.auth.hashers import check_password, make_password

from core.db_exceptions import handle_integrity_error
from core.auth_customer import CustomJWTAuthentication
from customer.serializers import CustomerProfileSerializer, CustomerUpdateSerializer
from .models import Customer

from core.log_queries import log_queries


class InforCustomer(APIView):
    """
        Lấy thông tin người dùng hiện tại, 
        Chỉ 1 truy vấn cơ sở dữ liệu, 
        Loại bỏ các trường nhạy cảm (password, is_active, is_delete)
        Thời gian 25ms
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    def get(self, request):
        user = (
            Customer.objects
            .defer('password',"is_active","is_delete")
            .get(id=request.user.id)
        )
        serializer = CustomerProfileSerializer(user)

        return Response({
            "status": "success",
            "message": "Lấy Thông Tin của Quý Khách Thành Công",
            "data": serializer.data
        }, status=status.HTTP_200_OK)


class UpdateCustomer(APIView):
    """
        Cập nhật thông tin Customer chỉ tốn 3 truy vấn SQL: 
        Một SELECT kiểm tra user tồn tại và active, 
        Một UPDATE cập nhật các trường được gửi, 
        Một COMMIT để hoàn tất transaction. 
        Thời gian 14-50ms
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    @transaction.atomic
    def patch(self, request):
        try:
            serializer = CustomerUpdateSerializer(data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

            update_data = serializer.validated_data

            if update_data:
                Customer.objects.filter(id=request.user.id).update(**update_data)

        except IntegrityError as e:
            return Response(handle_integrity_error(e), status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "status": "success",
            "message": "Cập nhật thông tin khách hàng thành công",
        }, status=status.HTTP_200_OK)
        
        
class UpdatePasswordCustomer(APIView):
    """
        Tốn 2 truy vấn
        thời gian : 600ms - 2s
        thời gian quá nhiều do mã hoá mật khẩu
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    def patch(self, request):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response({
                "status": "error", "message": "Vui lòng điền đầy đủ old_password và new_password"
            }, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response(
                {"status": "error", "message": "Mật khẩu mới phải có ít nhất 8 ký tự"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_pw = Customer.objects.filter(id=request.user.id).values_list("password", flat=True).first()
        if not user_pw or not check_password(old_password, user_pw):
            return Response(
                {"status": "error", "message": "Mật khẩu cũ không đúng"},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_password = make_password(new_password)
        Customer.objects.filter(id=request.user.id).update(password=new_password)

        return Response(
            {"status": "success", "message": "Đổi mật khẩu thành công"},
            status=status.HTTP_200_OK
        )