import os
from django.db.models.signals import pre_save, post_delete, post_save
from django.dispatch import receiver
from .models import Customer


@receiver(pre_save, sender=Customer)
def auto_delete_old_avatar_on_update(sender, instance, **kwargs):
    """Xóa avatar cũ khi cập nhật avatar mới."""
    if not instance.pk:
        return

    try:
        old_avatar = Customer.objects.get(pk=instance.pk).avatar
    except Customer.DoesNotExist:
        return

    new_avatar = instance.avatar
    if old_avatar and old_avatar != new_avatar:
        if os.path.isfile(old_avatar.path):
            os.remove(old_avatar.path)


@receiver(post_delete, sender=Customer)
def auto_delete_avatar_on_delete(sender, instance, **kwargs):
    """Xóa file avatar khi Customer bị xóa."""
    if instance.avatar and os.path.isfile(instance.avatar.path):
        os.remove(instance.avatar.path)
