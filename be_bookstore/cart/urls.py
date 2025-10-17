from django.urls import path
from . import update_cart, views

app_name = 'cart'
urlpatterns = [
    path('', views.CartListAPIView.as_view(), name='carts'),
    path('update/<int:book_id>/', update_cart.UpdateCartAPI.as_view(), name='update'),
]
