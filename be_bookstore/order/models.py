from django.db import models
from django.utils import timezone
from django.utils.crypto import get_random_string


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Chờ xử lý'),
        ('processing', 'Đang xử lý'),
        ('paid', 'Đã thanh toán'),
        ('delivered', 'Đã giao hàng'),
        ('cancelled', 'Đã hủy'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('cod', 'Thanh toán khi nhận hàng'),
        ('momo', 'MoMo'),
        ('zalopay', 'ZaloPay'),
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
    ]

    customer = models.ForeignKey('customer.Customer', on_delete=models.CASCADE, related_name='orders')
    order_code = models.CharField(max_length=20, unique=True, editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cod')
    shipping_address = models.TextField()
    note = models.TextField(blank=True, null=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'order'
        verbose_name = 'Đơn hàng'
        verbose_name_plural = 'Đơn hàng'
        ordering = ['-created_at']

    def __str__(self):
        return f"Đơn hàng #{self.order_code} - {self.customer.full_name}"

    def save(self, *args, **kwargs):
        if not self.order_code:
            self.order_code = f"OD{get_random_string(8).upper()}"
        super().save(*args, **kwargs)

    def update_total(self):
        """Tự động tính lại tổng tiền khi thêm hoặc xóa sản phẩm"""
        total = sum(item.subtotal for item in self.items.all())
        self.total_amount = total
        self.save(update_fields=['total_amount', 'updated_at'])


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    book = models.ForeignKey('book.Book', on_delete=models.SET_NULL, null=True, related_name='order_items')
    book_title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'order_item'
        verbose_name = 'Sản phẩm trong đơn'
        verbose_name_plural = 'Chi tiết đơn hàng'

    def __str__(self):
        return f"{self.book_title} x {self.quantity}"

    def save(self, *args, **kwargs):
        self.subtotal = self.price * self.quantity
        super().save(*args, **kwargs)
