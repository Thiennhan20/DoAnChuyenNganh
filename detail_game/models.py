from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save
from django.dispatch import receiver
# Create your models here.

class ChatMessage(models.Model):
    username = models.CharField(max_length=255)
    message = models.TextField()
    avatar = models.URLField(max_length=500, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username}: {self.message[:50]} ({self.timestamp})"

class HighScore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    day = models.CharField(max_length=10, blank=True, null=True)  # Trường lưu ngày
    week = models.IntegerField(blank=True, null=True)  # Trường lưu tuần

    def save(self, *args, **kwargs):
        # Log giá trị `day` và `week`
        print(f"Saving HighScore: {self.user.username}, Day: {self.day}, Week: {self.week}")
        super().save(*args, **kwargs)

    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='', blank=True, null=True)

    def __str__(self):
        return self.user.username
    
@receiver(pre_save, sender=UserProfile)
def delete_old_avatar(sender, instance, **kwargs):
    if instance.pk:  # Kiểm tra nếu đây là bản ghi đã tồn tại
        try:
            old_avatar = UserProfile.objects.get(pk=instance.pk).avatar
            if old_avatar and old_avatar != instance.avatar and old_avatar.name != '':
                # Xóa file nếu avatar đã thay đổi
                old_avatar.delete(save=False)
                ChatMessage.objects.filter(username=instance.user.username).update(avatar=instance.avatar.url)
        except UserProfile.DoesNotExist:
            pass


