# analysis/views.py
import requests 
from django.http import JsonResponse 
from django.views.decorators.csrf import csrf_exempt 
from django.views.decorators.http import require_POST 
from django.contrib.auth.hashers import make_password

from rest_framework.decorators import api_view
from django.contrib.auth.hashers import check_password

from django.utils import timezone
from uuid import uuid4
from rest_framework.response import Response
from myapp.models import UserInfo
from django.db import IntegrityError, DatabaseError


@csrf_exempt
@require_POST
def parse_image(request):
    image = request.FILES.get('image')
    ##uploaded_by = request.POST.get('uploaded_by', 'anonymous')

    if not image:
        return JsonResponse({'error': '缺少圖片檔案'}, status=400)

    # 呼叫 Flask OCR API
    try:
        flask_url = 'http://localhost:5000/ocr'
        files = {'image': image.file}
        flask_res = requests.post(flask_url, files=files, timeout=10)
        flask_res.raise_for_status()
        data = flask_res.json()
        result_text = data.get('text', '')
        result_count = data.get('count',0)
        status = 'success'
        error_msg = ''
    except requests.exceptions.RequestException as e:
        result_text = ''
        status = 'failed'
        error_msg = str(e)

    # 寫入資料表（如果有 ImageAnalysis）
    # ImageAnalysis.objects.create(
    #     file_name=image.name,
    #     file_path=f'media/uploads/original/{image.name}',
    #     uploaded_by=uploaded_by,
    #     analysis_result=result_text,
    #     status=status,
    #     error_message=error_msg,
    #     created_at=timezone.now(),
    #     updated_at=timezone.now()
    # )

    if status == 'failed':
        return JsonResponse({'error': 'OCR 失敗', 'detail': error_msg}, status=500)

    return JsonResponse({'result': result_text, 'count': result_count}, status=200)


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    print(username)
    print(password)
    if not username or not password:
            return Response({'LoginStatus': 'Failed','message': '帳號與密碼為必填'}, status=400)
    try:     
        user = UserInfo.objects.get(UserName=username)

        print(user.UserID)  # ✅ 這時候 user 已經存在了

        if check_password(password, user.Password): 
            return Response({'LoginStatus' : 'Sucessed', 'message': '登入成功', 'UserID' : user.UserID})
        else:
            return Response({'LoginStatus' : 'Failed', 'message': '帳號或密碼錯誤'}, status=401)

    except UserInfo.DoesNotExist:
        return Response({'LoginStatus' : 'Failed', 'message': '帳號或密碼錯誤'}, status=404)


@api_view(['POST'])
def register_view(request):
    try:
        userid = request.data.get('userId')
        username = request.data.get('username')
        password = request.data.get('password')

        print(username)
        print(password)
        # 🧩 驗證輸入
        print("確認欄位是否有空")
        if not username or not password or not userid:
            return Response({
                'RegisterStatus': 'Failed',
                'message': '帳號與密碼以及userid為必填'
            }, status=400)

        print("確認帳號是否重複")
        # 🧩 檢查帳號是否已存在
        if UserInfo.objects.filter(UserName=username).exists():
            return Response({
                'RegisterStatus': 'Failed',
                'message': '帳號已存在'
            }, status=409)
        print("插入至資料表中")
        # ✅ 建立新使用者（密碼加密 + 系統欄位填入）
        new_user = UserInfo(
            DataID=str(uuid4().hex),
            UserID=userid,
            UserName=username,
            Password=make_password(password),
            CreateID='system',
            CreateDate=timezone.now(),
            UpdateID='system',
            UpdateDate=timezone.now(),
            DataFlag=b'\x00'
        )
        print("插入至資料表成功")
        new_user.save()

        return Response({
            'RegisterStatus': 'Success',
            'message': '註冊成功！',
            'username': username
        }, status=200)

    # 捕捉資料庫錯誤
    except IntegrityError:
        return Response({
            'RegisterStatus': 'Failed',
            'message': '資料庫錯誤（可能是主鍵或欄位衝突）'
        }, status=500)

    except DatabaseError as e:
        return Response({
            'RegisterStatus': 'Failed',
            'message': f'資料庫發生錯誤：{str(e)}'
        }, status=500)

    # 其他例外錯誤
    except Exception as e:
        return Response({
            'RegisterStatus': 'Failed',
            'message': f'系統錯誤：{str(e)}'
        }, status=500)