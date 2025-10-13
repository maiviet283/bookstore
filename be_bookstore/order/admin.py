from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('book_title', 'price', 'quantity', 'subtotal', 'created_at')
    can_delete = False
    show_change_link = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_code', 'customer', 'status', 'payment_method',
        'total_amount', 'created_at', 'updated_at'
    )
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('order_code', 'customer__full_name', 'customer__email', 'customer__phone')
    readonly_fields = ('order_code', 'total_amount', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    inlines = [OrderItemInline]

    fieldsets = (
        ('Thông tin chung', {
            'fields': (
                'order_code', 'customer', 'status', 'payment_method',
                'total_amount', 'created_at', 'updated_at'
            )
        }),
        ('Thông tin giao hàng', {
            'fields': ('shipping_address', 'note')
        }),
    )

    def get_queryset(self, request):
        """Tối ưu truy vấn bằng select_related"""
        qs = super().get_queryset(request)
        return qs.select_related('customer')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'book_title', 'price', 'quantity', 'subtotal', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('book_title', 'order__order_code', 'order__customer__full_name')
    readonly_fields = ('subtotal', 'created_at')
    ordering = ('-created_at',)

    def get_queryset(self, request):
        """Tối ưu truy vấn để tránh N+1"""
        qs = super().get_queryset(request)
        return qs.select_related('order', 'book')
