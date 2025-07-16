from django.db import models
from myapp.models import UserInfo

class UploadedFile(models.Model):
    CATEGORY_CHOICES = [
        ('doc', '文件'),
        ('img', '圖片'),
        ('vid', '影片'),
        ('aud', '音訊'),
        ('oth', '其他'),
    ]

    filename = models.CharField(max_length=255)
    filepath = models.CharField(max_length=500)
    file_size = models.BigIntegerField()
    file_type = models.CharField(max_length=50)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)
    download_count = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, blank=True, null=True)
    uploader = models.ForeignKey(UserInfo,on_delete=models.CASCADE)
    is_shared = models.BooleanField(default=False)

    class Meta:
        db_table = 'my_app_UploadedFile'  # ✅ 若你要用自訂表名