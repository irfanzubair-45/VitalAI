import os
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.fernet import Fernet

# Derive a Fernet key from an environment secret
def _derive_key(secret: str, salt: bytes = b'vitalai_salt') -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100_000,
    )
    return base64.urlsafe_b64encode(kdf.derive(secret.encode()))

# Get Fernet instance – uses APP_SECRET env var or a fallback for dev
def get_fernet() -> Fernet:
    secret = os.getenv('APP_SECRET')
    if not secret:
        # In development a static key is acceptable; replace before production
        secret = 'development-secret-key-please-change'
    key = _derive_key(secret)
    return Fernet(key)

def encrypt_bytes(data: bytes) -> bytes:
    """Encrypt raw bytes and return the ciphertext."""
    f = get_fernet()
    return f.encrypt(data)

def decrypt_bytes(token: bytes) -> bytes:
    """Decrypt ciphertext produced by `encrypt_bytes`."""
    f = get_fernet()
    return f.decrypt(token)

