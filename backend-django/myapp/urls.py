from django.urls import path
from .views import parse_image
from .views import login_view, register_view

urlpatterns = [
    path('parse_image/', parse_image, name='parse_image'),
    path('login_view/', login_view, name='login_view'),
    path('register/', register_view, name='register_view'),  # ✅ 加上這行
]

