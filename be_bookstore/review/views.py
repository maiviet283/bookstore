from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.db import DatabaseError

from core.auth_customer import CustomJWTAuthentication
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer
from core.log_queries import log_queries
from core.responses import success_response, error_response


class ReviewListAPIView(APIView):
    """
        Lấy Toàn bộ bình luận trên mỗi cuốn sách của người dùng
        - Đối số truyền vào là id của Sách
        - Tốn 1 truy vấn SQL
        - Thời gian: 25-50ms
    """
    permission_classes = [AllowAny]

    @log_queries
    def get(self, request, book_id):
        try:
            reviews = (
                Review.objects
                .filter(book_id=book_id)
                .select_related('customer')
                .only(
                    'id', 'rating', 'comment', 'updated_at',
                    'customer__id', 'customer__full_name', 'customer__username'
                )
                .order_by('-updated_at')
            )

            serializer = ReviewSerializer(reviews, many=True)
            return success_response(
                message="Lấy danh sách bình luận thành công",
                data={"count": len(serializer.data), "results": serializer.data},
                http_status=status.HTTP_200_OK,
            )

        except DatabaseError:
            return error_response(
                message="Lỗi cơ sở dữ liệu.",
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        except Exception:
            return error_response(
                message="Lỗi máy chủ không xác định.",
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ReviewAddAPIView(APIView):
    """
        Tạo bình luận cho người dùng
        - Đối số truyền vào trên URL là id của Sách
        - Đối số truyền vào Body là Rating và Comment
        - Tốn 1 truy vấn SQL
        - Thời gian: 20-150ms
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    def post(self, request, book_id):
        customer_id = request.user.id
        serializer = ReviewCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return error_response(
                message="Dữ liệu không hợp lệ",
                errors=serializer.errors,
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data

        try:
            Review.objects.create(
                customer_id=customer_id,
                book_id=book_id,
                rating=data["rating"],
                comment=data["comment"]
            )
            return success_response(
                message="Thêm bình luận thành công.",
                http_status=status.HTTP_201_CREATED,
            )

        except DatabaseError:
            return error_response(
                message="Lỗi cơ sở dữ liệu.",
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ReviewUpdateAPIView(APIView):
    """
        Sửa bình luận của người dùng
        - Đối số truyền vào trên URL là id của bình luận
        - Người dùng chỉ được sửa bình luận của chính họ
        - Tốn 1 truy vấn SQL
        - Thời gian: 30-60ms
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    def put(self, request, review_id):
        customer_id = request.user.id
        serializer = ReviewCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return error_response(
                message="Dữ liệu không hợp lệ",
                errors=serializer.errors,
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        data = serializer.validated_data

        try:
            updated = (
                Review.objects
                .filter(id=review_id, customer_id=customer_id)
                .update(
                    rating=data["rating"],
                    comment=data["comment"]
                )
            )

            if updated == 0:
                return error_response(
                    message="Không tìm thấy bình luận hoặc bạn không có quyền sửa.",
                    http_status=status.HTTP_404_NOT_FOUND,
                )

            return success_response(
                message="Cập nhật bình luận thành công.",
                http_status=status.HTTP_200_OK,
            )

        except DatabaseError:
            return error_response(
                message="Lỗi cơ sở dữ liệu.",
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ReviewDeleteAPIView(APIView):
    """
        Xóa bình luận của người dùng
        - Đối số truyền vào trên URL là id của bình luận
        - Chỉ người tạo bình luận mới có quyền xóa
        - Tốn 3 truy vấn SQL, nhưng chỉ 1 truy vấn chạm vào DB
        - BEGIN/COMMIT là truy vấn nhẹ, không ảnh hưởng nặng
        - Thời gian: 30-140ms
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    @log_queries
    def delete(self, request, review_id):
        customer_id = request.user.id

        try:
            deleted, _ = (
                Review.objects
                .filter(id=review_id, customer_id=customer_id)
                .delete()
            )

            if deleted == 0:
                return error_response(
                    message="Không tìm thấy bình luận hoặc bạn không có quyền xóa.",
                    http_status=status.HTTP_404_NOT_FOUND,
                )

            return success_response(
                message="Xóa bình luận thành công.",
                http_status=status.HTTP_200_OK,
            )

        except DatabaseError:
            return error_response(
                message="Lỗi cơ sở dữ liệu.",
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
