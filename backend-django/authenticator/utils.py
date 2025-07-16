# 3️⃣ Utility function: validate token by jti & ip
from rest_framework.exceptions import AuthenticationFailed

def validate_token_payload(payload, request):
    from .models import JWTBlacklist  # 延遲匯入

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