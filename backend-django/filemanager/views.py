from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import api_view, parser_classes
from django.conf import settings
import os
from filemanager.models import UploadedFile
from myapp.models import UserInfo
from rest_framework.response import Response
from django.http import FileResponse
from .serializers import UploadedFileSerializer


# Create your views here.
@api_view(['POST'])
@parser_classes([MultiPartParser])
def FileUpload_view(request):
    uploader = request.POST.get('user_id')
    uploaded_file = request.FILES.get('file')

    if not uploaded_file or not uploader:
        return JsonResponse({'message': '缺少檔案或 user_id'}, status=400)

    # ✅ 建立使用者專屬資料夾
    user_folder = os.path.join(settings.MEDIA_ROOT, f'uploads/user_{uploader}')
    os.makedirs(user_folder, exist_ok=True)

    # ✅ 儲存檔案
    save_path = os.path.join(user_folder, uploaded_file.name)
    with open(save_path, 'wb+') as f:
        for chunk in uploaded_file.chunks():
            f.write(chunk)

    uploader_object = UserInfo.objects.get(DataID = uploader)

    # ✅ 存入資料庫（儲存相對路徑）
    UploadedFile.objects.create(
        filename=uploaded_file.name,
        filepath=os.path.relpath(save_path, settings.MEDIA_ROOT),
        file_size=uploaded_file.size,
        file_type=uploaded_file.content_type,
        uploader=uploader_object,
        is_shared=False,
    )

    return JsonResponse({'message': 'Upload Success'})



@api_view(['POST'])
def searchlist(request):
    requester = request.POST.get('user_id')
    if not requester:
        return Response({'error': '缺少 user_id'}, status=400)
    
    files = UploadedFile.objects.filter(uploader__DataID=requester).order_by('-id')
    serializer = UploadedFileSerializer(files, many=True)
    print(files)
    print(serializer)
    return Response(serializer.data)

@api_view(['POST'])
def Downloadfile(request):
    print(request)
    file_id = request.POST.get('file_id')
    print('field:'+ file_id)
    try:
        file_obj = UploadedFile.objects.get(id=file_id)
        file_path = os.path.join(settings.MEDIA_ROOT, file_obj.filepath)
        print(file_obj.filename)
        print(file_path)
        response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_obj.filename)
        response["Access-Control-Expose-Headers"] = "Content-Disposition" 
        return response
    except UploadedFile.DoesNotExist:
        return Response({'error': '找不到該檔案'}, status=404)
    except FileNotFoundError:
        return Response({'error': '檔案不存在於磁碟'}, status=404)
    
@api_view(['Delete'])
def deletefile(request):
    file_id = request.query_params.get('file_id')  # ✅ 用 query string 傳參數

    if not file_id:
        return Response({'error': '缺少 file_id'}, status=400)

    try:
        file_obj = UploadedFile.objects.get(id=file_id)

        # 檔案完整路徑
        file_path = os.path.join(settings.MEDIA_ROOT, file_obj.filepath)

        # 刪除磁碟上的檔案
        if os.path.exists(file_path):
            os.remove(file_path)

        # 刪除資料庫紀錄
        file_obj.delete()

        return Response({'success': True, 'message': f'檔案 {file_id} 已成功刪除'})

    except UploadedFile.DoesNotExist:
        return Response({'error': '找不到該檔案'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
import urllib.parse    
import mimetypes
@api_view(['POST'])
def Previewfile(request):
    print(request)
    file_id = request.POST.get('file_id')
    print('field:'+ file_id)
    try:
        file_obj = UploadedFile.objects.get(id=file_id)
        file_path = os.path.join(settings.MEDIA_ROOT, file_obj.filepath)

        print(file_obj.filename)
        print(file_path)
        
        # 建立檔案回傳
        response = FileResponse(open(file_path, 'rb'), as_attachment=False, filename=file_obj.filename)
        mime_type, _ = mimetypes.guess_type(file_path)
        response["Content-Type"] = mime_type or 'application/octet-stream'
        # ✅ filename 編碼（解決中文亂碼問題）
        filename_encoded = urllib.parse.quote(file_obj.filename)
        # ✅ 使用 inline 讓 PDF 能在瀏覽器預覽
        response["Content-Disposition"] = f"inline; filename*=UTF-8''{filename_encoded}"

        # 允許前端讀取 Content-Disposition
        response["Access-Control-Expose-Headers"] = "Content-Disposition, Content-Type" 

        
        return response
    except UploadedFile.DoesNotExist:
        return Response({'error': '找不到該檔案'}, status=404)
    except FileNotFoundError:
        return Response({'error': '檔案不存在於磁碟'}, status=404)