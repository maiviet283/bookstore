import os
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.core.cache import caches

from .models import Order, OrderItem

cache = caches['data_cart_cache']


# XÓA CACHE KHI ORDER THAY ĐỔI
@receiver(post_save, sender=Order)
@receiver(post_delete, sender=Order)
def clear_order_cache(sender, instance, **kwargs):
    """Xóa cache khi Order thay đổi."""
    customer_id = instance.customer_id
    cache_key = f'order_info_{customer_id}'
    cache.delete(cache_key)


@receiver(post_save, sender=OrderItem)
@receiver(post_delete, sender=OrderItem)
def clear_orderitem_cache(sender, instance, **kwargs):
    """Xóa cache khi OrderItem thay đổi."""
    if instance.order_id:
        customer_id = instance.order.customer_id
        cache_key = f'order_info_{customer_id}'
        cache.delete(cache_key)
