from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

# 1️⃣ JWT Blacklist Table
class JWTBlacklist(models.Model):
    jti = models.CharField(max_length=128, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    revoked_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"{self.jti} (Revoked: {self.revoked_at})"


# 2️⃣ Login Sessions Table
class LoginSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    refresh_token = models.TextField()
    jti = models.CharField(max_length=128)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(null=True, blank=True)
    login_at = models.DateTimeField(default=timezone.now)
    logout_at = models.DateTimeField(null=True, blank=True)
    revoked = models.BooleanField(default=False)

    def __str__(self):
        return f"Session {self.id} for {self.user.username} ({self.ip_address})"


# 3️⃣ Utility function: validate token by jti & ip
from rest_framework.exceptions import AuthenticationFailed
from .models import JWTBlacklist

def validate_token_payload(payload, request):
    # 1. Check token expiration (optional, already done by lib)

    # 2. Check jti in blacklist
    if JWTBlacklist.objects.filter(jti=payload['jti']).exists():
        raise AuthenticationFailed("This token has been revoked.")

    # 3. Check IP matching
    token_ip = payload.get('ip')
    request_ip = request.META.get('REMOTE_ADDR')
    if token_ip and token_ip != request_ip:
        raise AuthenticationFailed("IP address mismatch.")

    # Passed
    return True
