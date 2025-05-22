from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.ocr import ocr_api  # 匯入 Blueprint

# import os
# from dotenv import load_dotenv

# load_dotenv()  # 從 .env 載入環境變數

# # 測試讀取成功與否
# print("金鑰位置：", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))


app = Flask(__name__)
app.register_blueprint(ocr_api)  # 註冊 OCR API

CORS(app)  # 允許跨域（前端 React 可呼叫）

# 首頁測試用
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask API 運作正常！"})

# POST 範例：接收資料回傳
@app.route("/echo", methods=["POST"])
def echo():
    data = request.get_json()
    return jsonify({
        "status": "success",
        "received": data
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)



