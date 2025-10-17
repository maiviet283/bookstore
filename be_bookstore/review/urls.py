from django.urls import path
from . import views

app_name = 'review'
urlpatterns = [
    path('<int:book_id>/', views.ReviewListAPIView.as_view(), name='review-list'),
    path('create/<int:book_id>/', views.ReviewAddAPIView.as_view(), name='create-review'),
    path('update/<int:review_id>/', views.ReviewUpdateAPIView.as_view(), name='update-review'),
    path('delete/<int:review_id>/', views.ReviewDeleteAPIView.as_view(), name='delete-review'),
]
