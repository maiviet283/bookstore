import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "be_bookstore.settings")
django.setup()

from customer.models import Customer
from cart.models import Cart


def main():
    customers = Customer.objects.all()
    created_count = 0

    for customer in customers:
        # Nếu customer chưa có cart thì tạo mới
        if not hasattr(customer, 'cart'):
            Cart.objects.create(customer=customer)
            created_count += 1
            print(f"🛒 Tạo giỏ hàng cho khách hàng: {customer.full_name or customer.username}")

    print(f"\n✅ Đã tạo {created_count} giỏ hàng mới cho khách hàng chưa có.")


if __name__ == "__main__":
    main()
