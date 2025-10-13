from django.urls import path
from . import auth_views

app_name = 'customer'
urlpatterns = [
    path('register/', auth_views.RegisterCustomer.as_view(), name='register'),
    path('login/', auth_views.LoginCustomer.as_view(), name='login'),
    path('logout/', auth_views.LogoutCustomer.as_view(), name='logout')
]
