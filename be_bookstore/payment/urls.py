from django.urls import path
from . import views

app_name = 'payment'
urlpatterns = [
    path('vnqr/<str:order_code>/', views.vnqr_payment, name='vnqr_payment'),
]
