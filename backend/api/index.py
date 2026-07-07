import json
import os

runtime = os.environ.get("VERCEL_RUNTIME", "")
if runtime:
    os.environ.setdefault("DATA_DIR", "/tmp")

from app.main import app

if not runtime:
    pass

handler = app
