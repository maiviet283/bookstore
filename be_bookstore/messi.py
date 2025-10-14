import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "be_bookstore.settings")
django.setup()

from customer.models import Customer
from cart.models import Cart


def main():
    pass
if __name__ == "__main__":
    main()
