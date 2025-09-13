import os, jwt
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

PUB_KEY_PATH = os.getenv("JWT_PUBLIC_KEY_PATH", "").strip().lstrip("\\/")

if not os.path.isabs(PUB_KEY_PATH):
    PUB_KEY_PATH = os.path.join(BASE_DIR, PUB_KEY_PATH)

if not os.path.exists(PUB_KEY_PATH):
    raise RuntimeError(f"Public key file not found at {PUB_KEY_PATH}")

with open(PUB_KEY_PATH, "rb") as f:
    PUB_KEY = f.read()

ALGORITHM = os.getenv("JWT_ALGORITHM", "RS256")

def verify_message_token(token: str) -> dict:
    return jwt.decode(token, PUB_KEY, algorithms=[ALGORITHM], options={"verify_aud": False})
