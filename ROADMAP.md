# UPRE — Roadmap & Journal de bord

## Work log

### 2026-06-27 — Session init
- **Lu** : architecture systeme (`ressources/upre-architecture-systeme.html`)
- **Audite** : etat du build — backend regex-only, pas de LLM, UI fonctionnelle
- **Cree** : `backend/app/services/extraction_schema.py` — 91 champs normalises (9 categories)
- **Cree** : `backend/app/services/llm_provider.py` — couche d'abstraction `extract(text, fields, model_id)`
  - `DeepSeekProvider` / `AnthropicProvider` + fallback regex
- **Cree** : `backend/app/services/storage.py` — persistence partagee (remplace code duplique)

### 2026-06-27 (suite) — Features UI/UX
- **Ajoute** : corbeille projets (soft delete + restore + suppression definitive avec nettoyage disque)
- **Ajoute** : rename automatique apres extraction (`Typologie - Ville - Prix - Mandataire`)
- **Ajoute** : rename manuel inline dans la sidebar (clic crayon → edition)
- **Ajoute** : score de completude dans la sidebar (vert/orange/rouge)
- **Ajoute** : bulk import (ecran d'accueil, 1 projet cree par fichier)
- **Ajoute** : drag & drop fonctionnel avec feedback visuel (bordure bleue)
- **Ajoute** : pipeline progress bar cliquable (navigation directe entre etapes)
- **Ajoute** : boutons distincts "Analyser" / "Voir resultat"
- **Ajoute** : bouton "Tout analyser"

### 2026-06-27 (suite) — Pipeline LLM
- **Refactore** : `pipeline.py /control-r1` — remplace regex par `extract()` provider-agnostique
- **Fixe** : modele Anthropic `claude-sonnet-4-6` (l'ancien ID n'existait pas)
- **Ajoute** : `extract_pdf()` — Claude Vision lit PDF natif (plus de pdfplumber)
  - PDF envoye en base64 via API Anthropic (type: document)
  - Anti-injection renforce : Claude voit le vrai document
- **Implemente** : Enrichissement avec Claude — Fit Fonctionnel + Emotionnel + Intentions UPRE
- **Ajoute** : pre-remplissage automatique du formulaire AIF depuis l'extraction
- **Ajoute** : cache extraction + enrichissement dans `_projects.json` (restauration automatique)

### 2026-06-27 (suite) — Securite
- **Renforce** : sanitizer double couche (upload + avant appel LLM)
- **Renforce** : system prompt anti-injection (XML tagging, balises `<document>`)
- **UX** : fichier bloque affiche alertes detaillees + message "Ce n'est pas un bug"
- **UX** : fichier "flagge" (orange) pour PII/termes confidentiels sans bloquer

### 2026-06-27 (suite) — Infrastructure
- **Setup** : `.env` + `python-dotenv` pour cles API
- **Setup** : `.gitignore` (`.env`, `output/`, `__pycache__/`, `node_modules/`, `.next/`)
- **Setup** : `.env.example` template
- **Ajoute** : `httpx`, `python-dotenv` dans `requirements.txt`

---

## Phase 0 — Preuve d'extraction

**Objectif** : Mise en place pipeline LLM/Vision, UI existante conservee (`frontend/`).

### Fait
- [x] Brancher `extract()` dans `pipeline.py /control-r1`
- [x] Provider Anthropic fonctionnel (Claude Sonnet 4.6)
- [x] Cache extraction + enrichissement
- [x] UI fonctionnelle (4 etapes, drag-drop, bulk import, scores sidebar)
- [x] Sanitizer + anti-injection (double couche)

### A faire
- [ ] Mettre en place le harnais de comparaison extraction vs verite terrain (script Python diff champ a champ)
- [ ] Constituer un jeu de test de 20-30 R1 reels avec verite terrain
- [ ] Remplacer pdfplumber restant par PyMuPDF / pdf2image pour les fichiers non-PDF
- [ ] Activer l'agent 00-qa pour validation des sorties
- [ ] **Revoir les 91 champs avec le client** (trop de champs ? prioriser ?)

### Cout API estime
- Claude Sonnet 4.6 : ~0.03 $ / appel (extraction texte)
- Avec PDF Vision : ~0.04-0.05 $ / appel (document natif)
- Requete R1 standard (1-3 documents) : 0.03 - 0.06 $ / analyse complete
- Enrichissement (Fit Fonctionnel + Emotionnel) : ~0.01 $ / appel supplementaire

### References
- Architecture : `ressources/upre-architecture-systeme.html`
- Schema d'extraction : `backend/app/services/extraction_schema.py` (91 champs)
- Provider LLM : `backend/app/services/llm_provider.py`
- Storage : `backend/app/services/storage.py`
- Sanitizer : `backend/app/services/sanitizer.py`
- Pipeline : `backend/app/routes/pipeline.py`
- Projets : `backend/app/routes/projects.py`
- Upload : `backend/app/routes/upload.py`
- Agents : `.opencode/agents/`
- Regles : `.opencode/rules/`

---

## Checkpoint — 27 juin 2026

### Pour reprendre
```powershell
# Terminal 1 — Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### Fichiers cles
| Fichier | Role |
|---|---|
| `backend/.env` | Cle API Anthropic (gitignore) |
| `backend/.env.example` | Template sans cle |
| `output/_projects.json` | Base de donnees plate (projets, fichiers, extractions) |
| `output/<id>/` | Fichiers uploades par projet |
| `ROADMAP.md` | Ce document |
| `AGENTS.md` | Fiche projet (stack, references) |
