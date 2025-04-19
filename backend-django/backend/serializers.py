from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(cls, user):
        token = super().get_token(user)
        # 加入自訂的 'kid' 到 token 的 header
        token.header['kid'] = settings.KID
        return token
