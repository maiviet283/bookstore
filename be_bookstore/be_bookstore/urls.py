from django.conf.urls.i18n import i18n_patterns
from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
    
    path('api/customers/', include('customer.urls')),
    path('api/books/', include("book.urls")),
    path('api/carts/', include('cart.urls')),
    
    path('', include('core.urls')),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]

urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
)

handler404 = "core.exceptions.custom_404_handler"
