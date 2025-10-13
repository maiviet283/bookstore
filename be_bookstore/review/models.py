from django.db import models
from django.utils import timezone


class Review(models.Model):
    RATING_CHOICES = [
        (1, '⭐'),
        (2, '⭐⭐'),
        (3, '⭐⭐⭐'),
        (4, '⭐⭐⭐⭐'),
        (5, '⭐⭐⭐⭐⭐'),
    ]

    book = models.ForeignKey('book.Book', on_delete=models.CASCADE, related_name='reviews')
    customer = models.ForeignKey('customer.Customer', on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'review'
        verbose_name = 'Đánh Giá'
        verbose_name_plural = 'Đánh Giá Sách'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer} - {self.book} ({self.rating}⭐)"
