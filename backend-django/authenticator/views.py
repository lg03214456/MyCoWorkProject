# Create your views here.
from authenticator.utils import validate_token_payload
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from authenticator.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer


class MyProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        token_payload = request.auth  # 從 JWT middleware 拿到 payload
        validate_token_payload(token_payload, request)

        # 若通過驗證，回傳資料
        return Response({ "msg": "Hello, secure world!" })
    


class MyTokenObtainView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer