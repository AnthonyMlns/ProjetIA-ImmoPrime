"""Shared storage helpers — JSON persistence for _projects.json."""

import json
from pathlib import Path

PROJECTS_FILE: Path = Path(__file__).resolve().parent.parent.parent.parent / "output" / "_projects.json"


def load() -> dict:
    if PROJECTS_FILE.exists():
        for enc in ("utf-8-sig", "utf-8", "latin-1"):
            try:
                return json.loads(PROJECTS_FILE.read_text(encoding=enc))
            except (json.JSONDecodeError, UnicodeDecodeError):
                continue
        PROJECTS_FILE.unlink(missing_ok=True)
    return {}


def save(data: dict):
    clean = _sanitize_dict(data)
    PROJECTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    PROJECTS_FILE.write_text(json.dumps(clean, ensure_ascii=False, indent=2), encoding="utf-8")


def _sanitize_dict(obj):
    if isinstance(obj, dict):
        return {k: _sanitize_dict(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_sanitize_dict(v) for v in obj]
    if isinstance(obj, str):
        return obj.encode("utf-8", errors="replace").decode("utf-8")
    return obj
