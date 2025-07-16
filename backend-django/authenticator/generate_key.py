import os
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from pathlib import Path
from datetime import datetime


# 金鑰版本名稱（依時間生成）
key_version = datetime.now().strftime("%Y%m%d")
kid = f"key-{key_version}"


# 金鑰資料夾位置
#key_dir = current_dir / "jwt_keys"
key_dir = Path("jwt_keys")
key_dir.mkdir(exist_ok=True)

# 建立金鑰
private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_key = private_key.public_key()

# 儲存私鑰
with open(key_dir / f"{kid}-private.pem", "wb") as f:
    f.write(private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ))

# 儲存公鑰
with open(key_dir / f"{kid}-public.pem", "wb") as f:
    f.write(public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ))

print(f"金鑰版本 {kid} 已生成並儲存於 {key_dir}")
