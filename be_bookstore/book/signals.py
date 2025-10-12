import os
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver

from .models import Book, BookImage


@receiver(pre_save, sender=Book)
def auto_delete_old_book_image_on_update(sender, instance, **kwargs):
    """
    Xóa ảnh cũ của sách khi cập nhật ảnh mới.
    """
    if not instance.pk:
        return  # tạo mới -> bỏ qua

    try:
        old_image = Book.objects.get(pk=instance.pk).image
    except Book.DoesNotExist:
        return

    new_image = instance.image
    # Nếu ảnh thay đổi và file cũ tồn tại -> xóa file cũ
    if old_image and old_image != new_image:
        if os.path.isfile(old_image.path):
            os.remove(old_image.path)


@receiver(post_delete, sender=Book)
def auto_delete_book_image_on_delete(sender, instance, **kwargs):
    """
    Xóa file ảnh khi sách bị xóa.
    """
    if instance.image and os.path.isfile(instance.image.path):
        os.remove(instance.image.path)


@receiver(pre_save, sender=BookImage)
def auto_delete_old_gallery_image_on_update(sender, instance, **kwargs):
    """
    Xóa ảnh cũ trong gallery khi cập nhật ảnh mới.
    """
    if not instance.pk:
        return

    try:
        old_image = BookImage.objects.get(pk=instance.pk).image
    except BookImage.DoesNotExist:
        return

    new_image = instance.image
    if old_image and old_image != new_image:
        if os.path.isfile(old_image.path):
            os.remove(old_image.path)


@receiver(post_delete, sender=BookImage)
def auto_delete_gallery_image_on_delete(sender, instance, **kwargs):
    """
    Xóa file ảnh trong gallery khi bản ghi bị xóa.
    """
    if instance.image and os.path.isfile(instance.image.path):
        os.remove(instance.image.path)
