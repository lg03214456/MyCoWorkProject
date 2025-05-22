from django.db import models  # ✅ 正確引用
from django.utils import timezone
import uuid

# 1️⃣ JWT Blacklist Table
class JWTBlacklist(models.Model):
    jti = models.CharField(max_length=128, primary_key=True)
    # user = models.ForeignKey(UserInfo, on_delete=models.CASCADE, null=True, blank=True)
    user_id = models.CharField(max_length=32, db_column='user_id')
    revoked_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"{self.jti} (Revoked: {self.revoked_at})"


# 2️⃣ Login Sessions Table
class LoginSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # user = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    user_id = models.CharField(max_length=32, db_column='user_id')
    refresh_token = models.TextField()
    jti = models.CharField(max_length=128)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(null=True, blank=True)
    login_at = models.DateTimeField(default=timezone.now)
    logout_at = models.DateTimeField(null=True, blank=True)
    revoked = models.BooleanField(default=False)

    def __str__(self):
        return f"Session {self.id} for {self.user.username} ({self.ip_address})"


