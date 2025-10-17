from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from django.conf.urls.i18n import i18n_patterns
from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static


schema_view = get_schema_view(
    openapi.Info(
        title="Bookstore API",
        default_version='v1',
        description="Tài liệu mô tả API cho Bookstore (Django + DRF)",
        contact=openapi.Contact(email="support@bookstore.vn"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)


urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
    
    path('api/customers/', include('customer.urls')),
    path('api/books/', include("book.urls")),
    path('api/carts/', include('cart.urls')),
    path('api/orders/', include('order.urls')),
    path('api/payments/', include('payment.urls')),
    path('api/reviews/', include('review.urls')),
    
    path('', include('core.urls')),
    
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
)

handler404 = "core.exceptions.custom_404_handler"
