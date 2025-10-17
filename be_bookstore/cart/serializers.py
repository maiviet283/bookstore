from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    book_id = serializers.IntegerField(source="book.id", read_only=True)
    book_name = serializers.CharField(source="book.name", read_only=True)
    book_image = serializers.SerializerMethodField()
    book_price = serializers.FloatField(source="book.price", read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "book_id",
            "book_name",
            "book_image",
            "book_price",
            "quantity",
            "price_at_time",
        ]

    def get_book_image(self, obj):
        request = self.context.get("request")
        if obj.book.image:
            return request.build_absolute_uri(obj.book.image.url) if request else obj.book.image.url
        return None


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.FloatField()

    class Meta:
        model = Cart
        fields = ["id", "status", "total_amount", "items"]
