from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.authentication import JWTAuthentication

from customer.models import Customer


class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token.get('id')
            if not user_id:
                raise InvalidToken("Token Thông Báo Không có ID trên")
            user = Customer.objects.get(id=user_id)
            return user
        except Customer.DoesNotExist:
            raise InvalidToken("Khách Hàng Này Không Tồn Tại")
        