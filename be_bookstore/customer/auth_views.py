from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.db.models import Q
from django.db import IntegrityError, DatabaseError, transaction

from core.db_exceptions import handle_integrity_error
from core.auth_customer import CustomJWTAuthentication
from .serializers import RegisterSerializer, LoginSerializer
from .models import Customer
from cart.models import Cart

from core.log_queries import log_queries


class RegisterCustomer(APIView):
    """
        Đăng Ký Tài Khoản Khách Hàng
        Thực hiện tổng cộng 5 truy vấn SQL, gồm các truy vấn như 
        BEGIN, COMMIT, và SET TRANSACTION ISOLATION do Django ORM tự động thêm.

        Trong đó, chỉ có 2 truy vấn thực sự chạm vào cơ sở dữ liệu:
            INSERT INTO customer ... tạo tài khoản khách hàng
            INSERT INTO cart ... tạo giỏ hàng mặc định
    """
    permission_classes = [AllowAny]

    @log_queries
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                    "status": "error",
                    "message": "Dữ liệu không hợp lệ.",
                    # "errors": serializer.errors,
                }, status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                user = serializer.save()
                Cart.objects.create(customer=user, status="active")

        except IntegrityError as e:
            err_info = handle_integrity_error(e)
            return Response({
                    "status": "error",
                    "message": err_info["message"],
                    "errors": err_info["errors"],
                }, status=status.HTTP_400_BAD_REQUEST,
            )

        except DatabaseError as e:
            return Response({
                    "status": "error",
                    "message": "Lỗi hệ thống cơ sở dữ liệu.",
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response({
                "status": "success",
                "message": "Đăng ký tài khoản thành công.",
            }, status=status.HTTP_201_CREATED,
        )


class LoginCustomer(APIView):
    """
        Đăng Nhập tài khoản khách hàng
        Tổng số truy vấn SQL: 2
        Django mở transaction / set isolation level (1 Query)→ không ảnh hưởng hiệu suất.
        Thực sự chạm DB: 
            - SELECT ... FROM customer WHERE username__iexact=... OR phone=... LIMIT 1 
        → lấy thông tin user cần kiểm tra password, status, is_delete.
        Chỉ 1 truy vấn thực sự đụng DB →  hiệu quả.
    """
    permission_classes = [AllowAny]

    @log_queries
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "message": "Dữ liệu không hợp lệ.",
            }, status=status.HTTP_400_BAD_REQUEST)

        username_or_phone = serializer.validated_data["username_or_phone"]
        password = serializer.validated_data["password"]

        user = Customer.objects.filter(
            Q(username__iexact=username_or_phone) | Q(phone=username_or_phone)
        ).only("id", "username", "phone", "password", "is_active", "is_delete").first()

        if not user or user.is_delete or not user.is_active:
            return Response({
                "status": "error",
                "message": "Tài khoản không tồn tại hoặc đã bị khóa.",
            }, status=status.HTTP_403_FORBIDDEN)

        if not user.check_password(password):
            return Response({
                "status": "error",
                "message": "Tên đăng nhập hoặc mật khẩu không đúng.",
            }, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken()
        refresh["id"] = user.pk
        refresh["username"] = user.username
        access = refresh.access_token
        
        return Response({
            "message": "Đăng nhập thành công.",
            "data": {
                "access": str(access),
                "refresh": str(refresh),
            },
        }, status=status.HTTP_200_OK)


class LogoutCustomer(APIView):
    """
        Logout khách hàng bằng cách blacklist Refresh token.
        Dùng model Customer riêng, không ảnh hưởng.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"status": "error", "message": "Cần có Refresh token."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            RefreshToken(refresh_token).blacklist()
        except TokenError:
            return Response(
                {"status": "error", "message": "Refresh token không hợp lệ hoặc đã hết hạn."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"status": "success", "message": "Đăng xuất thành công."},
            status=status.HTTP_205_RESET_CONTENT
        )