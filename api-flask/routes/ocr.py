# 📁 routes/ocr.py
# from flask import Blueprint, request, jsonify
# import easyocr

# ocr_api = Blueprint('ocr_api', __name__)

# # 初始化 EasyOCR（支援繁體中文 + 英文）
# reader = easyocr.Reader(['ch_tra', 'en'])

# @ocr_api.route('/ocr', methods=['POST'])
# def ocr():
#     # 檢查是否有檔案欄位
#     if 'image' not in request.files:
#         return jsonify({'error': '缺少參數：image'}), 400

#     image = request.files['image']

#     try:
#         result = reader.readtext(image.read(), detail=0)
#         return jsonify({
#             'text': '\n'.join(result),
#             'count': len(result)
#         }), 200
#     except Exception as e:
#         return jsonify({'error': 'OCR 解析失敗', 'message': str(e)}), 500
# 📁 routes/ocr.py
from flask import Blueprint, request, jsonify
from google.cloud import vision
from google.cloud.vision_v1 import types
import os

# 載入 .env 中的金鑰路徑（若有）
from dotenv import load_dotenv
load_dotenv()

ocr_api = Blueprint('ocr_api', __name__)

# 初始化 Google Vision API 客戶端
client = vision.ImageAnnotatorClient()

@ocr_api.route('/ocr', methods=['POST'])
def ocr():
    if 'image' not in request.files:
        return jsonify({'error': '缺少參數：image'}), 400

    image_file = request.files['image']
    image_content = image_file.read()

    try:
        image = vision.Image(content=image_content)
        response = client.text_detection(image=image)

        if response.error.message:
            return jsonify({'error': 'API 回傳錯誤', 'message': response.error.message}), 500

        # 取得文字辨識結果（包含整段文字）
        annotations = response.text_annotations
        if not annotations:
            return jsonify({'text': '', 'count': 0}), 200

        # 第一筆是整段文字
        full_text = annotations[0].description

        return jsonify({
            'text': full_text.strip(),
            'count': len(full_text.strip().splitlines())
        }), 200

    except Exception as e:
        return jsonify({'error': 'OCR 解析失敗', 'message': str(e)}), 500


