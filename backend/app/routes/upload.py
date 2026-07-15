"""File upload routes — sanitization + extraction."""

from pathlib import Path

from fastapi import APIRouter, UploadFile, File, Form

from app.services.sanitizer import sanitize
from app.services.extractor import extract_content
from app.services.storage import load as load_projects, save as save_projects, PROJECTS_FILE

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parent.parent.parent.parent / "output"
DATA_DIR.mkdir(exist_ok=True)


@router.post("/enrichissement")
async def upload_enrichissement(
    project_id: str = Form(...),
    file: UploadFile = File(...),
):
    projects = load_projects()
    if project_id not in projects:
        return {"error": "Project not found"}, 404

    content = await file.read()
    if not content:
        return {"success": False, "error": "Fichier vide"}

    enrich_dir = DATA_DIR / project_id / "enrichissement"
    enrich_dir.mkdir(parents=True, exist_ok=True)
    dest = enrich_dir / file.filename
    dest.write_bytes(content)

    proj = projects[project_id]
    proj.setdefault("enrichissement_attachments", []).append({
        "name": file.filename,
        "type": Path(file.filename).suffix.lstrip("."),
        "size": len(content),
    })
    save_projects(projects)

    return {"success": True, "file": {"name": file.filename, "size": len(content)}}


@router.post("/")
async def upload_file(
    project_id: str = Form(...),
    file: UploadFile = File(...),
):
    projects = load_projects()
    if project_id not in projects:
        return {"error": "Project not found"}, 404

    content = await file.read()
    if not content:
        return {"success": False, "error": "Fichier vide"}

    proj_dir = DATA_DIR / project_id
    proj_dir.mkdir(exist_ok=True)
    dest = proj_dir / file.filename
    dest.write_bytes(content)

    ext = Path(file.filename).suffix.lower()
    if ext in (".pdf", ".docx", ".doc", ".txt", ".md"):
        raw_text = extract_content(dest)
    else:
        raw_text = ""

    result = sanitize(raw_text) if raw_text else {"clean": "", "alerts": [], "blocked": False}

    has_warnings = any(
        a.startswith("PII_DETECTED") or a.startswith("CONFIDENTIAL_TERM")
        for a in result["alerts"]
    ) and not result["blocked"]

    file_record = {
        "name": file.filename,
        "type": ext.lstrip("."),
        "size": len(content),
        "blocked": result["blocked"],
        "flagged": has_warnings,
        "alertes": result["alerts"],
        "content": result["clean"] if not result["blocked"] else None,
        "success": not result["blocked"],
    }
    projects[project_id].setdefault("files", []).append(file_record)
    save_projects(projects)

    return {"success": not result["blocked"], "file": file_record}
