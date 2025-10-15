from django.urls import path
from . import views

app_name = 'cart'
urlpatterns = [
    path('', views.CartListAPIView.as_view(), name='carts'),
    path('add/<int:book_id>', views.AddBookToCart.as_view(), name='add-to-cart'),
]
