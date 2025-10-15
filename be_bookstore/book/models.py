from django.db import models
from django.utils.text import slugify
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'category'
        verbose_name = "Danh Mục"
        verbose_name_plural = "Danh Mục"


class Book(models.Model):
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='books')
    image = models.ImageField(upload_to='books/main/%Y/%m', blank=True, null=True)
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    author = models.CharField(max_length=255, blank=True, null=True)
    publisher = models.CharField(max_length=255, blank=True, null=True)
    published_date = models.DateField(blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_delete = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Book.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} (ID:{self.id})"
    
    class Meta:
        db_table = 'book'
        verbose_name = "Sách"
        verbose_name_plural = "Sách"


class BookImage(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='books/gallery/%Y/%m')
    alt = models.CharField(max_length=255, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.alt and self.book_id:
            self.alt = f"Ảnh của sách {self.book.name}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Ảnh của Sách {self.book.name}"
    
    class Meta:
        db_table = 'book_image'
        verbose_name = "Hình Ảnh Sách"
        verbose_name_plural = "Hình Ảnh Sách"
