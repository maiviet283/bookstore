from django.urls import path
from .views import BookListAPIView, BookDetailAPIView, CategoryListAPIView

app_name = 'book'

urlpatterns = [
    path('', BookListAPIView.as_view(), name='book-list'),
    path('<int:id>/', BookDetailAPIView.as_view(), name='book-detail'),
    path('categories/', CategoryListAPIView.as_view(), name='category-list')
]
