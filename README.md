# UPRE — Unique Prime Real Estate

Plateforme IA de transformation de fiches commerciales brutes en actifs immobiliers qualifiés, protégés et activables.

## Description

UPRE ingère des documents (R1, DPE, PDFs) fournis par les mandataires, extrait ~91 champs normalisés via Claude Vision, enrichit avec un Fit Fonctionnel / Émotionnel, et génère des livrables filtrés par niveau d'accès (Vignette, Note d'Actif, Asset Briefing).

## Stack

| Couche | Technologie |
|---|---|
| Frontend | Next.js 16 + React 19 + Tailwind 4 |
| Backend | FastAPI + Python 3.12 |
| IA | Anthropic Claude Sonnet 4.6 (extraction + enrichissement) |
| Stockage | JSON plat (`output/_projects.json`) → PostgreSQL cible Phase 1 |

## Prérequis

- Python 3.12+
- Node.js 20+
- Clé API Anthropic (`.env`)

## Installation

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # puis éditer .env avec la clé Anthropic

# Frontend
cd frontend
npm install
```

## Utilisation

```bash
# Terminal 1 — Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Ouvrir `http://localhost:3000`.

## Roadmap

| Phase | Statut | Description |
|---|---|---|
| 0 — Preuve d'extraction | 🟡 En cours | Pipeline LLM, UI 4 étapes, sanitizer |
| 1 — MVP | ⬜ À venir | PostgreSQL, harnais d'évaluation, agent QA |
| 2 — Vocal & Passeport | ⬜ À venir | Whisper, NDA, watermarking |
| 3 — Intention & Match | ⬜ À venir | Qualification acquéreur, matching |

- [x] Extraction LLM (Claude Sonnet 4.6)
- [x] UI 4 étapes (Dépôt, Contrôle R1, Enrichissement, AIF)
- [x] Cache extraction + enrichissement
- [ ] Harnais de comparaison extraction vs vérité terrain
- [ ] Jeu de test 20-30 R1 réels

## Architecture

`ressources/upre-architecture-systeme.html` — Architecture complète (4 couches, phasage, chiffrage).

## Contribuer

1. Brancher depuis `main`
2. Convention de commits : `feat(scope): description` / `fix(scope): description`
3. Une issue par fonctionnalité
4. PR → review → squash merge

## Licence

Interne UPRE — propriétaire.
