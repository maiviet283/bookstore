from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password, identify_hasher


class Customer(models.Model):
    GENDER_CHOICES = [
        ('M', 'Nam'),
        ('F', 'Nữ'),
        ('O', 'Khác'),
    ]

    avatar = models.ImageField(upload_to='avatars/%Y/%m', null=True, blank=True)
    full_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True, default='M')
    date_of_birth = models.DateField(null=True, blank=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)
    address = models.TextField(null=True, blank=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255)
    loyalty_points = models.IntegerField(default=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_delete = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.full_name or self.username} (ID:{self.pk})"
    
    def delete(self, using=None, keep_parents=False):
        """Soft delete."""
        self.is_delete = True
        self.save()
        
    def save(self, *args, **kwargs):
        try:
            identify_hasher(self.password)
        except ValueError:
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
        
    def check_password(self, raw_password):
        """ Kiểm tra mật khẩu người dùng nhập có khớp không."""
        return check_password(raw_password, self.password)

    class Meta:
        db_table = 'customer'
        ordering = ['-created_at']
        verbose_name = "Khách Hàng"
        verbose_name_plural = "Khách Hàng"
        
    @property
    def is_authenticated(self):
        return True
