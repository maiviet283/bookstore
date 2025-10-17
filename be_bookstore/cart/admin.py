from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1
    readonly_fields = ('subtotal', 'price_at_time')
    fields = ('book', 'quantity', 'price_at_time', 'subtotal')
    autocomplete_fields = ['book']
    show_change_link = True


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'status', 'total_amount_display', 'updated_at')
    list_filter = ('status', 'updated_at')
    search_fields = ('customer__full_name', 'customer__email')
    readonly_fields = ('total_amount', 'created_at', 'updated_at')
    inlines = [CartItemInline]
    ordering = ('id',)
    list_per_page = 20

    def total_amount_display(self, obj):
        return f"{obj.total_amount:,.0f} đ"
    total_amount_display.short_description = "Tổng tiền"

    def get_queryset(self, request):
        """Tối ưu truy vấn để tránh N+1 khi hiển thị tổng"""
        qs = super().get_queryset(request)
        return qs.select_related('customer')


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'book', 'quantity', 'price_display', 'subtotal_display')
    list_filter = ('cart__status',)
    search_fields = ('book__name', 'cart__customer__full_name')
    autocomplete_fields = ['book', 'cart']
    ordering = ('-id',)
    list_per_page = 20

    def price_display(self, obj):
        return f"{obj.price_at_time:,.0f} đ"
    price_display.short_description = "Giá tại thời điểm"

    def subtotal_display(self, obj):
        return f"{obj.subtotal:,.0f} đ"
    subtotal_display.short_description = "Thành tiền"
