from rest_framework import serializers
from .models import Book, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class BookSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'name', 'image', 'slug', 'price', 'author', 'category']


class BookDetailSerializer(BookSerializer):
    class Meta:
        model = Book
        exclude = ['created_at','updated_at','is_delete']