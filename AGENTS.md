# UPRE — Fiche projet

## En cours : Phase 0 — Preuve d'extraction

### Stack backend
- FastAPI (`backend/app/main.py`)
- Routes : `backend/app/routes/pipeline.py`, `upload.py`, `projects.py`
- Services : `backend/app/services/sanitizer.py`, `extractor.py`, `llm_provider.py`, `extraction_schema.py`
- Modèles : `backend/app/models.py`

### Stack frontend
- Next.js 16 App Router (`frontend/src/app/page.tsx`)
- API client : `frontend/src/lib/api.ts`
- Tailwind v4 + dark/light theme

### Référence
- Roadmap & journal : `ROADMAP.md`
- Architecture complète : `ressources/upre-architecture-systeme.html`
- Agents OpenCode : `.opencode/agents/`
- Règles NDA/RBAC : `.opencode/rules/`
