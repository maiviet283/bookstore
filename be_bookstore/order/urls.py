from django.urls import path
from . import views

app_name = 'order'
urlpatterns = [
    path('create/', views.CreateOrderAPIView.as_view(), name='create-order'),
    path('', views.OrderListAPIView.as_view(), name='orders')
]
