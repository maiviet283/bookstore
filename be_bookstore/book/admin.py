from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Book, BookImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'description')
    search_fields = ('name', 'description')
    prepopulated_fields = {"slug": ("name",)}
    list_per_page = 20
    

class BookImageInline(admin.StackedInline):
    model = BookImage
    extra = 1
    fields = ('preview', 'image', 'alt')
    readonly_fields = ('preview',)

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="80" height="100" style="object-fit: cover; border-radius: 4px;" />', obj.image.url)
        return "Chưa có ảnh"
    preview.short_description = "Xem trước"


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'author','price', 'stock', 'language', 'is_delete', 'thumbnail')
    list_filter = ('category', 'language', 'is_delete', 'created_at')
    search_fields = ('name', 'author', 'publisher', 'description')
    readonly_fields = ('created_at', 'updated_at', 'thumbnail_preview')
    prepopulated_fields = {"slug": ("name",)}
    inlines = [BookImageInline]
    list_per_page = 10
    ordering = ('-created_at',)

    fieldsets = (
        ("Thông tin cơ bản", {
            "fields": ( "thumbnail_preview", "image","name", "slug", "category", "description", "language")
        }),
        ("Chi tiết xuất bản", {
            "fields": ("author", "publisher", "published_date")
        }),
        ("Kinh doanh", {
            "fields": ("price", "stock", "is_delete")
        }),
        ("Thời gian", {
            "fields": ("created_at", "updated_at")
        }),
    )

    def thumbnail(self, obj):
        """Hiển thị thumbnail nhỏ trong list view"""
        if obj.image:
            return format_html('<img src="{}" width="66" height="99" style="object-fit: cover; border-radius: 4px;" />', obj.image.url)
        return "—"
    thumbnail.short_description = "Ảnh"

    def thumbnail_preview(self, obj):
        """Hiển thị ảnh lớn hơn trong form chi tiết"""
        if obj.image:
            return format_html('<img src="{}" width="200" height="260" style="object-fit: cover; border-radius: 6px; box-shadow: 0 0 5px rgba(0,0,0,0.2);" />', obj.image.url)
        return "Chưa có ảnh"
    thumbnail_preview.short_description = "Xem trước ảnh"
