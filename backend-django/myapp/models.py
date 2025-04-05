from django.db import models

# Create your models here.

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



class UserInfo(models.Model):
    dataid = models.CharField(db_column='DataID', max_length=32, primary_key=True)
    createid = models.CharField(db_column='CreateID', max_length=30)
    createdate = models.DateTimeField(db_column='CreateDate')
    updateid = models.CharField(db_column='UpdateID', max_length=30)
    updatedate = models.DateTimeField(db_column='UpdateDate')
    dataflag = models.BinaryField(db_column='DataFlag')
    userid = models.CharField(db_column='UserID', max_length=20)
    username = models.CharField(db_column='UserName', max_length=100)
    password = models.TextField(db_column='Password')  # 長文字對應 nvarchar(max)

    class Meta:
        db_table = 'my_app_userinfo'   # ✅ 這裡對應你 SQL Server 裡的實際表名
        managed = False                # ✅ 不讓 Django 對這張表做 migrate（因為已存在）
