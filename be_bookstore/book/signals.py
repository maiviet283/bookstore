import os
from django.core.cache import caches
from django.db.models.signals import pre_save, post_delete, post_save
from django.dispatch import receiver

from .models import Book, BookImage

cache = caches['data_book_cache']


@receiver(pre_save, sender=Book)
def auto_delete_old_book_image_on_update(sender, instance, **kwargs):
    """Xóa ảnh cũ của sách khi cập nhật ảnh mới."""
    if not instance.pk:
        return

    try:
        old_image = Book.objects.get(pk=instance.pk).image
    except Book.DoesNotExist:
        return

    new_image = instance.image
    if old_image and old_image != new_image and os.path.isfile(old_image.path):
        os.remove(old_image.path)


@receiver(post_delete, sender=Book)
def auto_delete_book_image_on_delete(sender, instance, **kwargs):
    """Xóa file ảnh khi sách bị xóa."""
    if instance.image and os.path.isfile(instance.image.path):
        os.remove(instance.image.path)


@receiver(pre_save, sender=BookImage)
def auto_delete_old_gallery_image_on_update(sender, instance, **kwargs):
    """Xóa ảnh cũ trong gallery khi cập nhật ảnh mới."""
    if not instance.pk:
        return

    try:
        old_image = BookImage.objects.get(pk=instance.pk).image
    except BookImage.DoesNotExist:
        return

    new_image = instance.image
    if old_image and old_image != new_image and os.path.isfile(old_image.path):
        os.remove(old_image.path)


@receiver(post_delete, sender=BookImage)
def auto_delete_gallery_image_on_delete(sender, instance, **kwargs):
    """Xóa file ảnh trong gallery khi bản ghi bị xóa."""
    if instance.image and os.path.isfile(instance.image.path):
        os.remove(instance.image.path)


# XỬ LÝ CACHE
@receiver(post_save, sender=Book)
@receiver(post_delete, sender=Book)
def clear_book_cache(sender, instance, **kwargs):
    """Tự động xóa cache khi sách được cập nhật hoặc xóa."""
    cache_key = f'book_detail:{instance.id}'
    cache.delete(cache_key)


@receiver(post_save, sender=BookImage)
@receiver(post_delete, sender=BookImage)
def clear_book_image_cache(sender, instance, **kwargs):
    """Xóa cache chi tiết sách khi ảnh gallery thay đổi."""
    if instance.book_id:
        cache_key = f'book_detail:{instance.book_id}'
        cache.delete(cache_key)
