"""Pipeline orchestration routes."""

import asyncio
import json
from datetime import datetime
from pathlib import Path

import httpx

from fastapi import APIRouter
from pydantic import BaseModel

from app.models import (
    AssetExtraction, AssetBloc, EnrichissementData, AIFData, PipelineResponse,
)
from app.services.extraction_schema import SCHEMA_FIELDS, FieldDef
from app.services.llm_provider import extract, extract_pdf, AnthropicProvider
from app.services.storage import load as load_projects, save as save_projects

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parent.parent.parent.parent / "output"
PROJECTS_FILE = DATA_DIR / "_projects.json"
DECISION_TEXTS = {
    1: "AIF direct avec vérification mandataire",
    2: "AIF possible avec complément oral court",
    3: "Entretien mandataire structuré requis",
    4: "Non traitable en l'état",
}


class ControlR1Request(BaseModel):
    project_id: str
    filename: str
    model_id: str = "anthropic"


class EnrichissementRequest(BaseModel):
    project_id: str
    data: EnrichissementData


class AIFGenerateRequest(BaseModel):
    project_id: str
    data: AIFData


@router.post("/control-r1")
async def control_r1(req: ControlR1Request):
    projects = load_projects()
    if req.project_id not in projects:
        return {"success": False, "error": "Project not found"}

    proj = projects[req.project_id]
    file_data = next(
        (f for f in proj.get("files", []) if f["name"] == req.filename and not f.get("blocked")),
        None,
    )
    if not file_data:
        return {"success": False, "error": "Fichier non trouvé ou bloqué"}

    content = file_data.get("content") or ""

    file_path = DATA_DIR / req.project_id / req.filename
    is_pdf = req.filename.lower().endswith(".pdf") and file_path.exists()
    if is_pdf:
        pdf_bytes = file_path.read_bytes()
        result = await extract_pdf(pdf_bytes, SCHEMA_FIELDS, req.model_id)
    else:
        result = await extract(content, SCHEMA_FIELDS, req.model_id)

    blocs: dict[str, AssetBloc] = {}
    for f in SCHEMA_FIELDS:
        val = result.fields.get(f.key)
        if val is not None:
            blocs[f.key] = AssetBloc(label=f.label, status="present", valeur=val)
        else:
            blocs[f.key] = AssetBloc(label=f.label, status="manquant")

    presents = sum(1 for b in blocs.values() if b.status == "present")
    score = round(presents / len(SCHEMA_FIELDS) * 100, 1)

    if score >= 85:
        decision = 1
    elif score >= 65:
        decision = 2
    elif score >= 40:
        decision = 3
    else:
        decision = 4

    questions = _generate_questions(blocs)

    asset = AssetExtraction(
        identifiant=f"UPRE-{datetime.now().year}-{len(proj.get('assets', [])) + 1:03d}",
        source=req.filename,
        content_length=len(content),
        blocs={k: b.model_dump() for k, b in blocs.items()},
        score=score,
        decision=decision,
        decision_txt=DECISION_TEXTS[decision],
        questions=questions,
        alertes=file_data.get("alertes", []),
    )

    proj["stage"] = max(2, proj.get("stage", 0))
    asset_data = asset.model_dump()
    proj.setdefault("assets", []).append(asset_data)
    file_data["extraction"] = asset_data
    save_projects(projects)

    return {
        "success": True,
        "data": asset.model_dump(),
        "_meta": {
            "provider": result.provider,
            "model": result.model,
            "error": result.error,
        },
    }


def _generate_questions(blocs: dict[str, AssetBloc]) -> list[str]:
    questions: list[str] = []
    missing_priority_1 = [
        k for k, b in blocs.items()
        if b.status == "manquant"
        and any(f.key == k and f.priority == 1 for f in SCHEMA_FIELDS)
    ]
    missing_priority_2 = [
        k for k, b in blocs.items()
        if b.status == "manquant"
        and any(f.key == k and f.priority == 2 for f in SCHEMA_FIELDS)
    ]

    if "prix" in missing_priority_1:
        questions.append("Quel est le prix de vente ou la fourchette de prix ?")
    if any(k in missing_priority_1 for k in ["mandataire", "mandat_numero"]):
        questions.append("Qui est le mandataire et quel est le numero de mandat ?")
    if "typologie" in missing_priority_1:
        questions.append("Quel est le type de bien (appartement, maison, etc.) ?")
    if any(k in missing_priority_1 for k in ["ville", "code_postal", "adresse"]):
        questions.append("Ou se situe le bien (ville, quartier, adresse) ?")
    if "surface_habitable" in missing_priority_1:
        questions.append("Quelles sont les surfaces (habitable, Carrez, terrain) ?")
    if any(k in missing_priority_1 for k in ["dpe_classe", "ges_classe"]):
        questions.append("Quel est le diagnostic de performance energetique (DPE/GES) ?")

    for k in missing_priority_2:
        field = next((f for f in SCHEMA_FIELDS if f.key == k), None)
        if field and len(questions) < 8:
            questions.append(f"{field.label} ?")
            if len(questions) >= 8:
                break

    if len(questions) < 3:
        questions = [
            "Pourquoi le bien est-il en vente ?",
            "Depuis combien de temps est-il commercialise ?",
            "Quel prix minimum le vendeur pourrait-il accepter ?",
            "Quels travaux ont ete realises ?",
            "Quelle est l'histoire du lieu ?",
        ]

    return questions


@router.post("/enrichissement")
async def enrichissement(req: EnrichissementRequest):
    projects = load_projects()
    proj = projects.get(req.project_id, {})
    files = proj.get("files", [])
    extraction = None
    for f in files:
        if f.get("extraction"):
            extraction = f["extraction"]
            break

    context_parts = []
    if extraction:
        blocs = extraction.get("blocs", {})
        for key in ("typologie", "ville", "surface_habitable", "nb_pieces",
                     "nb_chambres", "prix", "dpe_classe", "description",
                     "etat_general", "annee_construction", "copropriete",
                     "mandataire"):
            val = blocs.get(key, {}).get("valeur")
            if val:
                context_parts.append(f"{blocs[key]['label']}: {val}")

    context = "\n".join(context_parts) if context_parts else "Aucune donnee extraite."

    notes = req.data.notes.strip()

    prompt = (
        "Tu es un analyste immobilier UPRE specialise dans la qualification d'actifs prime.\n\n"
        "### Donnees extraites du bien\n"
        f"{context}\n\n"
        "### Notes du mandataire\n"
        f"{notes if notes else 'Aucune note fournie par le mandataire.'}\n\n"
        "Genere les trois sections suivantes au format JSON strict:\n\n"
        "1. **fit_fonctionnel** (2-3 phrases) : Analyse objective de la distribution, "
        "des surfaces, de l'etat, du potentiel de transformation, de la rentabilite.\n"
        "2. **fit_emotionnel** (2-3 phrases) : Analyse subjective de la lumiere, "
        "des volumes, des matieres, de l'atmosphere, de la vue, du cachet.\n"
        "3. **intentions** : Pour chaque intention UPRE (Habiter, Representer, "
        "Transmettre, Generer, Vivre autrement), attribue un statut "
        "(PROBABLE, POSSIBLE, IMPROBABLE) et un niveau (dominant, secondaire, mineur).\n\n"
        "Retourne UNIQUEMENT un objet JSON avec les cles: fit_fonctionnel, fit_emotionnel, intentions."
    )

    try:
        from app.services.llm_provider import AnthropicProvider
        provider = AnthropicProvider()
        system = (
            "Tu es un expert en immobilier de luxe. Tu rediges des analyses "
            "conformes aux standards UPRE. Sois precis, factuel, et inspire confiance. "
            "Reponds UNIQUEMENT avec l'objet JSON demande."
        )
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": provider.api_key,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json",
                },
                json={
                    "model": provider.model,
                    "max_tokens": 1024,
                    "temperature": 0.3,
                    "system": system,
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
        if resp.status_code == 200:
            data = resp.json()
            content = data["content"][0]["text"].strip()
            if content.startswith("```json"): content = content[7:].strip()
            if content.startswith("```"): content = content[3:].strip()
            if content.endswith("```"): content = content[:-3].strip()
            parsed = json.loads(content)
        else:
            raise RuntimeError(f"API error {resp.status_code}")
    except Exception:
        parsed = {
            "fit_fonctionnel": "Distribution a evaluer. Surfaces a confirmer.",
            "fit_emotionnel": "Lumiere, vue, matieres a documenter apres visite.",
            "intentions": {
                "Habiter": {"statut": "PROBABLE", "niveau": "dominant"},
                "Representer": {"statut": "A EVALUER", "niveau": "secondaire"},
                "Transmettre": {"statut": "A EVALUER", "niveau": "secondaire"},
                "Generer": {"statut": "A EVALUER", "niveau": "secondaire"},
                "Vivre autrement": {"statut": "A EVALUER", "niveau": "secondaire"},
            },
        }

    proj["stage"] = max(3, proj.get("stage", 0))
    enrich_data = {
        "enrichissement": req.data.model_dump(),
        "fit_fonctionnel": parsed.get("fit_fonctionnel", ""),
        "fit_emotionnel": parsed.get("fit_emotionnel", ""),
        "intentions": parsed.get("intentions", {}),
    }
    proj["enrichissement"] = enrich_data
    save_projects(projects)

    return {"success": True, "data": enrich_data}


@router.post("/aif")
async def generate_aif(req: AIFGenerateRequest):
    projects = load_projects()
    if req.project_id not in projects:
        return {"success": False, "error": "Project not found"}

    proj = projects[req.project_id]
    aif = req.data.model_dump()
    aif["version"] = "1.0"
    aif["created_at"] = datetime.now().isoformat()

    qualite = await _generer_qualite(aif)
    aif["qualite"] = qualite

    vignette = (
        f"{aif['typologie']} d'exception — {aif['ville']}\n"
        f"{aif['surface_habitable']:.0f} m² | {aif['nb_pieces']} pièces | {aif['nb_chambres']} chambres\n"
        f"Opportunité à qualifier. UPRE — Unique Prime Real Estate.\n"
        f"[INFORMATION PROTÉGÉE — NDA requis]"
    )

    note_actif = (
        f"NOTE D'ACTIF — {aif['nom_actif']}\n{'═' * 50}\n\n"
        f"Typologie : {aif['typologie']}\n"
        f"Localisation : {aif['ville']}\n"
        f"Surface : {aif['surface_habitable']:.0f} m²\n"
        f"Pièces : {aif['nb_pieces']} | Chambres : {aif['nb_chambres']}\n"
        f"DPE : {aif['dpe_classe'] or 'Non renseigné'}\n\n"
        f"FIT FONCTIONNEL\n{aif['fit_fonctionnel']}\n\n"
        f"FIT ÉMOTIONNEL\n{aif['fit_emotionnel']}\n\n"
        f"Note qualitative : {qualite['note']:.1f}/5\n"
        f"{chr(10).join(f'  {c['label']}: {c['score']}/5 — {c['commentaire']}' for c in qualite['criteres'])}\n\n"
        f"[PRIX ET ADRESSE — INFORMATION PROTÉGÉE — NDA requis]"
    )

    annonce_mandataire, parole_client, note_institutionnelle = await asyncio.gather(
        _generer_annonce_mandataire(aif),
        _generer_parole_client(aif),
        _generer_note_institutionnelle(aif),
    )

    asset_briefing = (
        f"═══════════════════════════════\n"
        f"CONFIDENTIEL UPRE\n"
        f"Asset Briefing — {aif['nom_actif']}\n"
        f"Ref : {aif['identifiant']} | v{aif['version']}\n"
        f"═══════════════════════════════\n\n"
        f"Prix : {aif['prix']:,.0f} EUR\n\n"
        f"{note_actif}"
    )

    proj.setdefault("assets", []).append({
        "aif": aif,
        "date": datetime.now().isoformat(),
        "vignette": vignette,
        "note_actif": note_actif,
        "asset_briefing": asset_briefing,
        "annonce_mandataire": annonce_mandataire,
        "parole_client": parole_client,
        "note_institutionnelle": note_institutionnelle,
    })
    proj["stage"] = max(4, proj.get("stage", 0))
    save_projects(projects)

    return {
        "success": True,
        "data": {
            "aif": aif,
            "vignette": vignette,
            "note_actif": note_actif,
            "asset_briefing": asset_briefing,
            "annonce_mandataire": annonce_mandataire,
            "parole_client": parole_client,
            "note_institutionnelle": note_institutionnelle,
        },
    }


async def _generer_annonce_mandataire(aif: dict) -> str:
    contexte = (
        f"Typologie : {aif.get('typologie', '?')}\n"
        f"Ville : {aif.get('ville', '?')}\n"
        f"Surface : {aif.get('surface_habitable', '?')} m²\n"
        f"Pièces : {aif.get('nb_pieces', '?')} | Chambres : {aif.get('nb_chambres', '?')}\n"
        f"Prix : {aif.get('prix', '?')} EUR\n"
        f"DPE : {aif.get('dpe_classe', 'NC')}\n"
        f"Fit fonctionnel : {aif.get('fit_fonctionnel', '?')}\n"
        f"Fit emotionnel : {aif.get('fit_emotionnel', '?')}\n"
    )
    prompt = (
        "Tu es un mandataire immobilier de luxe specialise en biens d'exception.\n\n"
        "Redige une annonce commerciale irresistible pour ce bien, en francais.\n"
        "Style : elegant, premium, envoutant — comme un mandataire haut de gamme\n"
        "qui presente le bien a ses meilleurs clients.\n"
        "Longueur : 1 paragraphe de 5-8 phrases.\n"
        "Ne mentionne PAS le prix exact, ni l'adresse precise.\n"
        "Termine par une phrase d'appel a l'action.\n\n"
        "### Description du bien\n"
        f"{contexte}\n\n"
        "Redige l'annonce :"
    )
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={"x-api-key": AnthropicProvider().api_key, "anthropic-version": "2023-06-01", "Content-Type": "application/json"},
                json={"model": "claude-sonnet-4-6", "max_tokens": 512, "temperature": 0.7,
                      "system": "Tu es un redacteur d'annonces immobilieres de luxe. Sois elegant et concis.",
                      "messages": [{"role": "user", "content": prompt}]},
            )
        if resp.status_code == 200:
            return resp.json()["content"][0]["text"].strip()
    except Exception:
        pass
    return "Annonce en cours de redaction par le mandataire."


async def _generer_parole_client(aif: dict) -> str:
    contexte = (
        f"Typologie : {aif.get('typologie', '?')}\n"
        f"Ville : {aif.get('ville', '?')}\n"
        f"Fit emotionnel : {aif.get('fit_emotionnel', '?')}\n"
    )
    prompt = (
        "Tu es un proprietaire qui raconte son bien avec emotion et authenticite.\n\n"
        "Redige un texte court (4-6 phrases) a la premiere personne, comme si\n"
        "le proprietaire parlait de son bien a un ami ou a un conseiller UPRE.\n"
        "Inclus des details personnels : pourquoi il a aime ce bien, ce qui rend\n"
        "cet endroit unique a ses yeux, des souvenirs, l'atmosphere qu'il ressent.\n"
        "Ton : chaleureux, sincere, personnel. Pas commercial.\n\n"
        "### Le bien\n"
        f"{contexte}\n\n"
        "Ce que le proprietaire dirait :"
    )
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={"x-api-key": AnthropicProvider().api_key, "anthropic-version": "2023-06-01", "Content-Type": "application/json"},
                json={"model": "claude-sonnet-4-6", "max_tokens": 512, "temperature": 0.8,
                      "system": "Tu incarnes un proprietaire qui parle de son bien avec authenticite et emotion.",
                      "messages": [{"role": "user", "content": prompt}]},
            )
        if resp.status_code == 200:
            return resp.json()["content"][0]["text"].strip()
    except Exception:
        pass
    return "Temoignage en cours de recueil par le mandataire."


async def _generer_note_institutionnelle(aif: dict) -> str:
    contexte = (
        f"Typologie : {aif.get('typologie', '?')}\n"
        f"Ville : {aif.get('ville', '?')}\n"
        f"Surface : {aif.get('surface_habitable', '?')} m²\n"
        f"Terrain : {aif.get('surface_terrain', '?')} m²\n"
        f"Pièces : {aif.get('nb_pieces', '?')} | Chambres : {aif.get('nb_chambres', '?')}\n"
        f"Prix : {aif.get('prix', '?')} EUR\n"
        f"DPE : {aif.get('dpe_classe', 'NC')}\n"
        f"Fit fonctionnel : {aif.get('fit_fonctionnel', '?')}\n"
        f"Fit emotionnel : {aif.get('fit_emotionnel', '?')}\n"
    )
    prompt = (
        "Tu es un analyste UPRE specialise dans la redaction de notes d'investissement "
        "pour des clients institutionnels (conciergeries, family offices, banques privees).\n\n"
        "Redige une note concise et professionnelle en francais (6-10 phrases) qui :\n"
        "- Decrit le bien et ses caracteristiques cles\n"
        "- Analyse son potentiel et son positionnement\n"
        "- Mentionne les points d'attention pour un investisseur institutionnel\n"
        "Ton : factuel, precis, professionnel. Pas de superlatifs inutiles.\n"
        "Ne mentionne PAS le prix exact ni l'adresse precise.\n\n"
        "### Caracteristiques du bien\n"
        f"{contexte}\n\n"
        "Note institutionnelle :"
    )
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={"x-api-key": AnthropicProvider().api_key, "anthropic-version": "2023-06-01", "Content-Type": "application/json"},
                json={"model": "claude-sonnet-4-6", "max_tokens": 512, "temperature": 0.4,
                      "system": "Tu es un analyste institutionnel specialise en immobilier prime. Sois factuel et professionnel.",
                      "messages": [{"role": "user", "content": prompt}]},
            )
        if resp.status_code == 200:
            return resp.json()["content"][0]["text"].strip()
    except Exception:
        pass
    return "Note institutionnelle en cours de preparation."


async def _generer_qualite(aif: dict) -> dict:
    contexte = (
        f"Typologie : {aif.get('typologie', '?')}\n"
        f"Ville : {aif.get('ville', '?')}\n"
        f"Surface : {aif.get('surface_habitable', '?')} m²\n"
        f"Terrain : {aif.get('surface_terrain', '?')} m²\n"
        f"Pièces : {aif.get('nb_pieces', '?')} | Chambres : {aif.get('nb_chambres', '?')}\n"
        f"Prix : {aif.get('prix', '?')} EUR\n"
        f"DPE : {aif.get('dpe_classe', 'NC')}\n"
        f"État : {aif.get('etat_general', '?')}\n"
        f"Fit emotionnel : {aif.get('fit_emotionnel', '?')}\n"
        f"Fit fonctionnel : {aif.get('fit_fonctionnel', '?')}\n"
    )
    prompt = (
        "Tu es un expert UPRE specialise dans la qualification d'actifs immobiliers prime.\n\n"
        "Evalue la qualite globale de ce bien sur 5 selon 4 criteres :\n\n"
        "1. **emplacement** — localisation, rayonnement, attractivite du quartier\n"
        "2. **cachet** — qualite architecturale, charme, potentiel emotionnel\n"
        "3. **etat** — qualite des prestations, entretien, modernite\n"
        "4. **potentiel** — coup de cœur, rareté, valeur perçue, adéquation UPRE\n\n"
        "Retourne UNIQUEMENT un objet JSON avec :\n"
        '{\n'
        '  "note": <moyenne des 4 notes, float sur 5>,\n'
        '  "criteres": [\n'
        '    {"label": "Emplacement", "score": <int/5>, "commentaire": "<une phrase>"},\n'
        '    {"label": "Cachet", "score": <int/5>, "commentaire": "<une phrase>"},\n'
        '    {"label": "Etat", "score": <int/5>, "commentaire": "<une phrase>"},\n'
        '    {"label": "Potentiel", "score": <int/5>, "commentaire": "<une phrase>"}\n'
        '  ]\n'
        '}\n\n'
        "Sois exigeant : 5/5 est exceptionnel, 3/5 est correct, 1/5 est faible.\n\n"
        "### Caracteristiques du bien\n"
        f"{contexte}"
    )
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={"x-api-key": AnthropicProvider().api_key, "anthropic-version": "2023-06-01", "Content-Type": "application/json"},
                json={"model": "claude-sonnet-4-6", "max_tokens": 512, "temperature": 0.3,
                      "system": "Tu es un expert en qualification d'actifs immobiliers prime. Reponds UNIQUEMENT en JSON.",
                      "messages": [{"role": "user", "content": prompt}]},
            )
        if resp.status_code == 200:
            content = resp.json()["content"][0]["text"].strip()
            for prefix in ("```json", "```"):
                if content.startswith(prefix):
                    content = content[len(prefix):].strip()
            if content.endswith("```"):
                content = content[:-3].strip()
            parsed = json.loads(content)
            return {
                "note": round(float(parsed.get("note", 0)), 1),
                "criteres": parsed.get("criteres", []),
            }
    except Exception:
        pass
    return {"note": 0.0, "criteres": []}
