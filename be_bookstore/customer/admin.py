from django.contrib import admin
from django.utils.html import format_html
from django import forms
from django.templatetags.static import static

from .models import Customer


class CustomerAdminForm(forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput(
            render_value=True,
            attrs={'class': 'vTextField', 'style': 'width: 100%;'}
        ),
        label="Mật khẩu"
    )

    class Meta:
        model = Customer
        fields = '__all__'


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    form = CustomerAdminForm

    list_display = (
        'avatar_preview',
        'full_name',
        'username',
        'phone',
        'loyalty_points',
        'is_active',
        'is_delete',
    )
    list_display_links = ('full_name', 'username')
    list_per_page = 15
    list_filter = ('is_active', 'is_delete', 'created_at')
    search_fields = ('full_name', 'username', 'email', 'phone')
    ordering = ('-created_at',)

    fieldsets = (
        ('Tài khoản', {
            'fields': ('username', 'password', 'email', 'phone')
        }),
        ('Thông tin cá nhân', {
            'fields': ('avatar_preview_detail', 'avatar', 'full_name', 'gender', 'date_of_birth', 'address')
        }),
        ('Trạng thái & Hệ thống', {
            'fields': ('loyalty_points', 'is_active', 'is_delete', 'created_at', 'updated_at')
        }),
    )
    readonly_fields = ('created_at', 'updated_at', 'avatar_preview_detail')

    # ====== PHẦN QUAN TRỌNG: HIỂN THỊ ẢNH ======

    def get_default_avatar(self, obj):
        """Trả về ảnh mặc định theo giới tính."""
        if obj.gender == 'M':
            return static('core/images/gender/boy.png')
        elif obj.gender == 'F':
            return static('core/images/gender/woman.png')
        else:
            return static('core/images/gender/3d.png')

    def avatar_preview(self, obj):
        """Ảnh nhỏ trong list hiển thị."""
        avatar_url = obj.avatar.url if obj.avatar else self.get_default_avatar(obj)
        return format_html(
            '<img src="{}" width="66" height="66" style="border-radius:50%; object-fit:cover;" />',
            avatar_url
        )
    avatar_preview.short_description = "Ảnh"

    def avatar_preview_detail(self, obj):
        """Ảnh lớn trong trang chi tiết."""
        avatar_url = obj.avatar.url if obj.avatar else self.get_default_avatar(obj)
        return format_html(
            '<img src="{}" width="240" style="border-radius:10px; object-fit:cover;" />',
            avatar_url
        )
    avatar_preview_detail.short_description = "Ảnh Đại Diện"
