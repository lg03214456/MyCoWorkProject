# 📁 routes/ocr.py
from flask import Blueprint, request, jsonify
import easyocr

ocr_api = Blueprint('ocr_api', __name__)

# 初始化 EasyOCR（支援繁體中文 + 英文）
reader = easyocr.Reader(['ch_tra', 'en'])

@ocr_api.route('/ocr', methods=['POST'])
def ocr():
    # 檢查是否有檔案欄位
    if 'image' not in request.files:
        return jsonify({'error': '缺少參數：image'}), 400

    image = request.files['image']

    try:
        result = reader.readtext(image.read(), detail=0)
        return jsonify({
            'text': '\n'.join(result),
            'count': len(result)
        }), 200
    except Exception as e:
        return jsonify({'error': 'OCR 解析失敗', 'message': str(e)}), 500
