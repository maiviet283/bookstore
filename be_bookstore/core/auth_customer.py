from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from rest_framework.exceptions import AuthenticationFailed as DRFAuthFailed
from django.db import DatabaseError, OperationalError
from customer.models import Customer


class CustomJWTAuthentication(JWTAuthentication):
    def get_validated_token(self, raw_token):
        """
        Kiểm tra token hợp lệ hay không.
        """
        try:
            return super().get_validated_token(raw_token)
        except InvalidToken:
            raise DRFAuthFailed({
                "message": "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
                "code": "invalid_or_expired_token"
            })
        except Exception as e:
            raise DRFAuthFailed({
                "message": f"Lỗi không xác định khi kiểm tra token: {str(e)}",
                "code": "token_validation_error"
            })

    def get_user(self, validated_token):
        """
        Lấy user từ token — nhưng là Customer, không phải User mặc định.
        """
        user_id = validated_token.get("id")
        if not user_id:
            raise InvalidToken("Token không có ID người dùng")

        try:
            customer = (
                Customer.objects
                .only('id','username','is_active')
                .get(id=user_id, is_delete=False, is_active=True)
            )
        except Customer.DoesNotExist:
            raise AuthenticationFailed({
                "message": "Người dùng không tồn tại hoặc đã bị xóa",
                "code": "user_not_found"
            })
        except DatabaseError:
            raise AuthenticationFailed({
                "message": "Lỗi cơ sở dữ liệu trong quá trình xác thực",
                "code": "database_error"
            })
        except OperationalError:
            raise AuthenticationFailed({
                "message": "Không thể kết nối cơ sở dữ liệu. Vui lòng thử lại sau.",
                "code": "db_connection_failed"
            })
        except Exception as e:
            raise AuthenticationFailed({
                "message": f"Lỗi không xác định khi lấy thông tin người dùng: {str(e)}",
                "code": "unknown_auth_error"
            })

        return customer
