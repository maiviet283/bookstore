from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from django.db import DatabaseError
from django.core.cache import caches

from .models import Book, Category
from .serializers import BookSerializer, BookDetailSerializer, CategoryListSerializer
from core.log_queries import log_queries
from core.responses import success_response, error_response

cache = caches['data_book_cache']


class CustomBookPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    max_page_size = 50


class CategoryListAPIView(APIView):
    """
        API Lấy danh sách danh mục
        - Thời gian xử lý trung bình: 3-15ms.
        - Chỉ tốn 1 truy vấn SQL
        - Dữ liệu được cache 10 phút trong Redis để giảm tải DB.
    """
    permission_classes = [AllowAny]

    @log_queries
    def get(self, request):
        cache_key = 'categories'

        try:
            cached_data = cache.get(cache_key)
            if cached_data:
                return success_response(
                    message="Lấy danh sách danh mục thành công (Cache)",
                    data=cached_data
                )

            categories = Category.objects.only('id', 'name')
            serializer = CategoryListSerializer(categories, many=True)
            data = serializer.data

            cache.set(cache_key, data, timeout=3600)

            return success_response(
                message="Lấy danh sách danh mục thành công (DB)",
                data=data
            )

        except DatabaseError:
            return error_response(
                message="Lỗi truy vấn cơ sở dữ liệu.",
                http_status=500
            )

        except Exception:
            return error_response(
                message="Đã xảy ra lỗi không mong muốn.",
                http_status=500
            )


class BookListAPIView(APIView):
    """
        API lấy toàn bộ danh sách Sách Đọc
        - Tốn 2 truy vấn SQL
        - Thời gian: 5-30ms
    """
    permission_classes = [AllowAny]

    @log_queries
    def get(self, request):
        qs = Book.objects.only(
            'id', 'name', 'image', 'price', 'author', 'slug'
        ).order_by('id')

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

        order = request.query_params.get("order", "").lower()
        if order == "asc":
            qs = qs.order_by("price")
        elif order == "desc":
            qs = qs.order_by("-price")

        paginator = CustomBookPagination()
        try:
            paginated_qs = paginator.paginate_queryset(qs, request, view=self)
        except Exception:
            return error_response(
                message="Lỗi khi phân trang.",
                http_status=400
            )

        serializer = BookSerializer(paginated_qs, many=True)

        data = {
            "count": paginator.page.paginator.count,
            "next": paginator.get_next_link(),
            "previous": paginator.get_previous_link(),
            "results": serializer.data,
        }

        return success_response(
            message="Lấy danh sách thành công",
            data=data
        )


class BookDetailAPIView(APIView):
    """
        API lấy thông tin chi tiết sách.
        - Thời gian xử lý trung bình: 2-20ms.
        - Chỉ tốn 2 truy vấn SQL khi dùng DB vì có prefetch_related.
        - Dữ liệu được cache 10 phút trong Redis để giảm tải DB.
    """
    permission_classes = [AllowAny]

    @log_queries
    def get(self, request, id):
        cache_key = f'book_detail:{id}'
        cached_data = cache.get(cache_key)

        if cached_data:
            return success_response(
                message="Lấy Thông Tin Sách Thành Công (Cache)",
                data=cached_data
            )

        try:
            book = (
                Book.objects
                .select_related('category')
                .prefetch_related('images')
                .defer('created_at', 'updated_at', 'is_delete', 'category__description')
                .get(id=id)
            )
        except (ValueError, TypeError, Book.DoesNotExist):
            return error_response(
                message="Không tìm thấy sách với ID được cung cấp.",
                http_status=404
            )

        serializer = BookDetailSerializer(book)
        data = serializer.data
        cache.set(cache_key, data, timeout=600)

        return success_response(
            message="Lấy Thông Tin Sách Thành Công (DB)",
            data=data
        )
