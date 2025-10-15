from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.core.cache import caches

from .models import Book
from .serializers import BookSerializer, BookDetailSerializer
from core.log_queries import log_queries

cache = caches['data_book_cache']


class CustomBookPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    max_page_size = 50


class BookListAPIView(APIView):
    permission_classes = [AllowAny]

    @log_queries
    def get(self, request):
        qs = Book.objects.select_related('category').only(
            'id', 'name', 'image', 'slug', 'price', 
            'author', 'category__id', 'category__name'
        )

        category_id = request.query_params.get("category")
        if category_id:
            try:
                category_id = int(category_id)
                qs = qs.filter(category_id=category_id)
            except (TypeError, ValueError):
                pass

        search = request.query_params.get("search")
        if search:
            qs = qs.filter(name__icontains=search.strip())

        order = request.query_params.get("order", "").lower()  # asc | desc
        if order == "asc":
            qs = qs.order_by("price")
        elif order == "desc":
            qs = qs.order_by("-price")

        paginator = CustomBookPagination()
        try:
            paginated_qs = paginator.paginate_queryset(qs, request, view=self)
        except Exception:
            return Response(
                {"message": "Lỗi khi phân trang."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = BookSerializer(paginated_qs, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class BookDetailAPIView(APIView):
    """
    API lấy thông tin chi tiết sách.
    - Thời gian xử lý trung bình: 15-60ms.
    - Chỉ tốn 1 truy vấn SQL khi dùng DB.
    - Dữ liệu được cache 10 phút trong Redis để giảm tải DB.
    """
    permission_classes = [AllowAny]

    @log_queries
    def get(self, request, id):
        cache_key = f'book_detail:{id}'
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response({
                "status": "success",
                "message": "Lấy Thông Tin Sách Thành Công (Cache)",
                "data": cached_data
            }, status=status.HTTP_200_OK)

        try:
            book = (
                Book.objects
                .select_related('category')
                .defer('created_at', 'updated_at', 'is_delete', 'category__description')
                .get(id=id)
            )
        except (ValueError, TypeError, Book.DoesNotExist):
            return Response({
                "status": "error",
                "message": "Không tìm thấy sách với ID được cung cấp."
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = BookDetailSerializer(book)
        data = serializer.data
        cache.set(cache_key, data, timeout=600)

        return Response({
            "status": "success",
            "message": "Lấy Thông Tin Sách Thành Công (DB)",
            "data": data
        }, status=status.HTTP_200_OK)