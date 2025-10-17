from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer cho từng sản phẩm trong đơn hàng"""
    book_name = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'book_name',
            'price',
            'quantity',
            'subtotal',
        ]

    def get_book_name(self, obj):
        return obj.book.name if obj.book else obj.book_title


class OrderSerializer(serializers.ModelSerializer):
    """Serializer chính cho đơn hàng"""
    items = OrderItemSerializer(many=True, read_only=True)
    item_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_code',
            'status',
            'payment_method',
            'total_amount',
            'item_count',
            'created_at',
            'items',
        ]
