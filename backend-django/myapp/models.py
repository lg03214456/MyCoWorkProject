from django.db import models  # ✅ 正確引用
# Create your models here.
from django.utils import timezone


class ImageAnalysis(models.Model):
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=500)
    uploaded_by = models.CharField(max_length=100)
    analysis_result = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=50, default='pending')
    error_message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.file_name
    class Meta:
        db_table = 'my_app_ImageAnalysis'  # ✅ 若你要用自訂表名


class UserInfo(models.Model):
    DataID = models.CharField(db_column='DataID', max_length=32, primary_key=True)
    CreateID = models.CharField(db_column='CreateID', max_length=30)
    CreateDate = models.DateTimeField(db_column='CreateDate', default=timezone.now)
    UpdateID = models.CharField(db_column='UpdateID', max_length=30)
    UpdateDate = models.DateTimeField(db_column='UpdateDate', default=timezone.now)
    DataFlag = models.BinaryField(db_column='DataFlag')
    UserID = models.CharField(db_column='UserID', max_length=20)
    UserName = models.CharField(db_column='UserName', max_length=100, unique=True)
    Password = models.TextField(db_column='Password')  # 長文字對應 nvarchar(max)
  
    class Meta:
        db_table = 'my_app_userinfo'  # ✅ 若你要用自訂表名