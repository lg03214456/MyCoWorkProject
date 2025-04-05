# analysis/views.py
import requests # type: ignore
from django.http import JsonResponse # type: ignore
from django.views.decorators.csrf import csrf_exempt # type: ignore
from django.views.decorators.http import require_POST # type: ignore
from django.utils import timezone # type: ignore

from rest_framework.decorators import api_view
from rest_framework.response import Response
from myapp.models import UserInfo


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
    try:
        user = UserInfo.objects.get(username=username)

        print(user.username, user.password)  # ✅ 這時候 user 已經存在了

        if user.password == password:  # ⚠ 若沒加密，可直接比對
            return Response({'message': '登入成功'})
        else:
            return Response({'message': '密碼錯誤'}, status=401)

    except UserInfo.DoesNotExist:
        return Response({'message': '帳號不存在'}, status=404)
