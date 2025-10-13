from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'book', 'customer', 'rating', 'short_comment', 'created_at', 'updated_at')
    list_filter = ('rating', 'book__name','created_at')
    search_fields = ('book__name', 'customer__user__username', 'comment')
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 20
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Thông tin chung', {
            'fields': ('book', 'customer', 'rating', 'comment')
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def short_comment(self, obj):
        """Hiển thị bình luận rút gọn trong danh sách"""
        if obj.comment:
            return (obj.comment[:50] + '...') if len(obj.comment) > 50 else obj.comment
        return "(Không có bình luận)"
    short_comment.short_description = "Bình luận"

    def get_queryset(self, request):
        """Tối ưu hóa truy vấn để tránh N+1"""
        qs = super().get_queryset(request)
        return qs.select_related('book', 'customer')
