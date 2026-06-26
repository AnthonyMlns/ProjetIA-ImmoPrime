"""Projects CRUD routes."""

import uuid
import shutil
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Query

from app.models import Project, ProjectCreate, ProjectRename
from app.services.storage import load as load_projects, save as save_projects

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parent.parent.parent.parent / "output"
DATA_DIR.mkdir(exist_ok=True)


def _build_project(pid: str, p: dict) -> Project:
    assets = p.get("assets", [])
    last_score = None
    if assets:
        last = assets[-1]
        if isinstance(last, dict):
            aif = last.get("aif", last)
            last_score = aif.get("score", aif.get("score_completude"))
    return Project(
        id=pid,
        name=p.get("name", pid),
        created=p.get("created", ""),
        stage=p.get("stage", 0),
        files_count=len(p.get("files", [])),
        assets_count=len(assets),
        trashed=p.get("trashed", False),
        last_score=last_score,
    )


@router.get("/")
async def list_projects(include_trashed: bool = Query(False)):
    projects = load_projects()
    result = []
    for pid, p in projects.items():
        if not include_trashed and p.get("trashed"):
            continue
        result.append(_build_project(pid, p))
    return sorted(result, key=lambda x: x.created, reverse=True)


@router.post("/")
async def create_project(body: ProjectCreate):
    projects = load_projects()
    pid = uuid.uuid4().hex[:8]
    projects[pid] = {
        "id": pid,
        "name": body.name,
        "created": datetime.now().isoformat(),
        "files": [],
        "assets": [],
        "stage": 0,
        "trashed": False,
    }
    save_projects(projects)
    return {"id": pid, "name": body.name}


@router.get("/{project_id}")
async def get_project(project_id: str):
    projects = load_projects()
    if project_id not in projects:
        return {"error": "Project not found"}, 404
    p = projects[project_id]
    return {
        **p,
        "files_count": len(p.get("files", [])),
        "assets_count": len(p.get("assets", [])),
    }


@router.post("/{project_id}/trash")
async def trash_project(project_id: str):
    projects = load_projects()
    if project_id not in projects:
        return {"error": "Project not found"}, 404
    projects[project_id]["trashed"] = True
    save_projects(projects)
    return {"ok": True, "trashed": True}


@router.post("/{project_id}/restore")
async def restore_project(project_id: str):
    projects = load_projects()
    if project_id not in projects:
        return {"error": "Project not found"}, 404
    projects[project_id]["trashed"] = False
    save_projects(projects)
    return {"ok": True, "trashed": False}


@router.delete("/{project_id}")
async def delete_project(project_id: str):
    projects = load_projects()
    if project_id in projects:
        proj_dir = DATA_DIR / project_id
        if proj_dir.exists():
            try:
                shutil.rmtree(proj_dir)
            except Exception:
                pass
        del projects[project_id]
        save_projects(projects)
    return {"ok": True}


@router.post("/{project_id}/rename")
async def rename_project(project_id: str, body: ProjectRename):
    projects = load_projects()
    if project_id not in projects:
        return {"error": "Project not found"}, 404
    projects[project_id]["name"] = body.name
    save_projects(projects)
    return {"ok": True, "name": body.name}
