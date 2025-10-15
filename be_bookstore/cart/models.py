from django.db import models
from django.utils import timezone


class Cart(models.Model):
    STATUS_CHOICES = [
        ('active', 'Đang hoạt động'),
        ('blocked', 'Đã khóa'),
    ]

    customer = models.OneToOneField('customer.Customer', on_delete=models.CASCADE, related_name='cart')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cart'
        verbose_name = 'Giỏ hàng'
        verbose_name_plural = 'Giỏ hàng'
        ordering = ['-updated_at']

    def __str__(self):
        return f"Giỏ hàng của {self.customer} - Tổng: {self.total_amount}đ"

    def update_total(self):
        """Tính lại tổng tiền mỗi khi giỏ hàng thay đổi"""
        total = sum(item.subtotal for item in self.items.all())
        self.total_amount = total
        self.save(update_fields=['total_amount', 'updated_at'])


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    book = models.ForeignKey('book.Book', on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2, default=0)  

    class Meta:
        db_table = 'cart_item'
        verbose_name = 'Sản phẩm trong giỏ'
        verbose_name_plural = 'Sản phẩm trong giỏ hàng'
        unique_together = ('cart', 'book')

    def __str__(self):
        return f"{self.book.name} x {self.quantity}"

    @property
    def subtotal(self):
        """Tổng tiền của item (theo giá tại thời điểm thêm vào giỏ)"""
        return self.price_at_time * self.quantity

    def save(self, *args, **kwargs):
        """Khi thêm mới hoặc cập nhật số lượng, tự cập nhật tổng giỏ hàng"""
        if not self.price_at_time:
            self.price_at_time = self.book.price

        super().save(*args, **kwargs)
        self.cart.update_total()

    def delete(self, *args, **kwargs):
        """Khi xóa item, tự cập nhật lại tổng giỏ hàng"""
        super().delete(*args, **kwargs)
        self.cart.update_total()
