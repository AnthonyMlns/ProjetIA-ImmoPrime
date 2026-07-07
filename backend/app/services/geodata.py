"""Geographic data fetcher — enriches the pipeline with area context.

Uses Wikipedia REST API (free, no key required) to fetch a summary
about the city/region, then formats it for the Claude enrichment prompt.
"""

from __future__ import annotations

import httpx


async def fetch_city_context(ville: str) -> dict[str, str]:
    ville_clean = ville.strip().title()
    url = (
        f"https://fr.wikipedia.org/api/rest_v1/page/summary/"
        f"{ville_clean.replace(' ', '_')}"
    )

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url)
        if resp.status_code == 200:
            data = resp.json()
            return {
                "title": data.get("title", ville_clean),
                "extract": data.get("extract", ""),
                "description": data.get("description", ""),
            }
    except Exception:
        pass

    return {"title": ville_clean, "extract": "", "description": ""}


def format_geo_context(ville: str, geo: dict[str, str]) -> str:
    if not geo.get("extract"):
        return f"## Contexte géographique\nVille : {ville}\n"

    extract = geo["extract"][:800]
    desc = geo.get("description", "")

    return (
        f"## Contexte géographique\n"
        f"Ville : {ville}\n"
        f"Région : {desc}\n"
        f"Caractéristiques : {extract}\n"
    )
