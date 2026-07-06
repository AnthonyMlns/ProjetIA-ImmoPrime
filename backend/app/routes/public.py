"""Public-facing routes for the showcase site.

Exposes only what a given visitor is allowed to see, filtered by each
asset's `visibility` and, later, by the visitor's auth/NDA status.
Mirrors the access levels defined in the architecture doc: Vignette ->
Note d'Actif -> Asset Briefing.
"""

from fastapi import APIRouter

from app.services.storage import load as load_projects

router = APIRouter()

PUBLISHABLE_VISIBILITY = {"public", "gated"}


def _iter_published_assets():
    projects = load_projects()
    for pid, proj in projects.items():
        if proj.get("trashed"):
            continue
        for asset in proj.get("assets", []):
            aif = asset.get("aif")
            if not aif:
                continue
            if aif.get("visibility") not in PUBLISHABLE_VISIBILITY:
                continue
            yield pid, asset, aif


def _vignette(aif: dict) -> dict:
    """Tier 1 — public listing. Price shown for public assets; withheld
    ("sur demande") for gated ones until the acquéreur/NDA flow exists."""
    is_gated = aif.get("visibility") == "gated"
    return {
        "id": aif["identifiant"],
        "typologie": aif.get("typologie", ""),
        "ville": aif.get("ville", ""),
        "surface_habitable": aif.get("surface_habitable", 0),
        "nb_pieces": aif.get("nb_pieces", 0),
        "nb_chambres": aif.get("nb_chambres", 0),
        "nb_sdb": aif.get("nb_sdb", 0),
        "dpe_classe": aif.get("dpe_classe"),
        "prix": None if is_gated else aif.get("prix", 0),
        "gated": is_gated,
    }


@router.get("/assets")
async def list_public_assets():
    return [_vignette(aif) for _, _, aif in _iter_published_assets()]


@router.get("/stats")
async def public_stats():
    projects = load_projects()
    active_projects = [p for p in projects.values() if not p.get("trashed")]
    vignettes = [_vignette(aif) for _, _, aif in _iter_published_assets()]
    public_count = sum(1 for v in vignettes if not v["gated"])
    gated_count = sum(1 for v in vignettes if v["gated"])
    portfolio_value = sum(v["prix"] or 0 for v in vignettes if not v["gated"])
    return {
        "mandats_actifs": len(active_projects),
        "public_listings": public_count,
        "gated_access": gated_count,
        "portfolio_value": portfolio_value,
    }


@router.get("/assets/{asset_id}")
async def get_public_asset(asset_id: str):
    for _, asset, aif in _iter_published_assets():
        if aif["identifiant"] != asset_id:
            continue
        result = _vignette(aif)
        # Note d'Actif / Asset Briefing tiers require buyer auth + NDA —
        # not implemented yet, so gated assets only ever surface the Vignette.
        if aif.get("visibility") == "public":
            result["fit_fonctionnel"] = aif.get("fit_fonctionnel", "")
            result["fit_emotionnel"] = aif.get("fit_emotionnel", "")
        return result
    return {"error": "Asset not found"}, 404
