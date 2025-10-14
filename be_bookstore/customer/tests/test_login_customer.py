from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from customer.models import Customer


class LoginCustomerTests(APITestCase):
    def setUp(self):
        # ✅ Tạo user thủ công thay vì create_user()
        self.user = Customer.objects.create(
            username="viet",
            phone="0901234567",
            is_active=True,
            is_delete=False,
        )
        self.user.set_password("password123456")
        self.user.save()

        self.login_url = reverse("customer:login")

    def test_login_success_with_username(self):
        """✅ Đăng nhập thành công bằng username"""
        data = {"username_or_phone": "viet", "password": "123456"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data["data"])
        print("✅ Đăng nhập thành công bằng username")

    def test_login_success_with_phone(self):
        """✅ Đăng nhập thành công bằng số điện thoại"""
        data = {"username_or_phone": "0901234567", "password": "123456"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("✅ Đăng nhập thành công bằng số điện thoại")

    def test_login_wrong_password(self):
        """❌ Sai mật khẩu"""
        data = {"username_or_phone": "viet", "password": "sai123"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        print("❌ Sai mật khẩu")

    def test_login_inactive_user(self):
        """❌ Tài khoản bị khóa"""
        self.user.is_active = False
        self.user.save()
        data = {"username_or_phone": "viet", "password": "123456"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        print("❌ Tài khoản bị khóa")

    def test_login_deleted_user(self):
        """❌ Tài khoản bị xóa"""
        self.user.is_delete = True
        self.user.save()
        data = {"username_or_phone": "viet", "password": "123456"}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        print("❌ Tài khoản bị xóa")

    def test_login_invalid_data(self):
        """❌ Thiếu dữ liệu đầu vào"""
        data = {"username_or_phone": ""}
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        print("❌ Thiếu dữ liệu đầu vào")
