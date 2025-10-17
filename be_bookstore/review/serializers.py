from rest_framework import serializers
from .models import Review
from customer.models import Customer


class CustomerMiniSerializer(serializers.ModelSerializer):
    """Serializer nhỏ gọn cho thông tin khách hàng"""
    class Meta:
        model = Customer
        fields = ['id', 'full_name', 'username']


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer cho đánh giá sách"""
    customer = CustomerMiniSerializer()

    class Meta:
        model = Review
        fields = ['id','customer', 'rating', 'comment', 'updated_at']
        

class ReviewCreateSerializer(serializers.Serializer):
    rating = serializers.IntegerField(required=False, default=5)
    comment = serializers.CharField(allow_blank=False, required=True)

    def validate_rating(self, value):
        """Chỉ cho phép rating từ 1-5 nếu sai → mặc định 5."""
        if not isinstance(value, int) or value < 1 or value > 5:
            return 5
        return value

    def validate_comment(self, value):
        """Bình luận không được rỗng hoặc chỉ chứa khoảng trắng."""
        if not value.strip():
            raise serializers.ValidationError("Bình luận không được để trống.")
        return value