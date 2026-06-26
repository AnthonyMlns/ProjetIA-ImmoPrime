"""Pydantic models for the UPRE API."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class Project(BaseModel):
    id: str
    name: str
    created: str
    stage: int = 0
    files_count: int = 0
    assets_count: int = 0
    trashed: bool = False
    last_score: float | None = None


class ProjectCreate(BaseModel):
    name: str = "Nouveau projet"


class ProjectRename(BaseModel):
    name: str


class AssetBloc(BaseModel):
    label: str
    status: str = "manquant"  # present | manquant | partiel
    valeur: Optional[str] = None


class AssetExtraction(BaseModel):
    identifiant: str
    source: str
    content_length: int
    blocs: dict[str, AssetBloc]
    score: float
    decision: int
    decision_txt: str
    questions: list[str] = []
    alertes: list[str] = []


class EnrichissementData(BaseModel):
    motivation: str = ""
    anciennete: str = ""
    prix_min: str = ""
    travaux: str = ""
    histoire: str = ""
    source: str = "déclaration orale mandataire"


class AIFData(BaseModel):
    identifiant: str
    nom_actif: str
    prix: float = 0
    typologie: str = ""
    ville: str = ""
    surface_habitable: float = 0
    nb_pieces: int = 0
    nb_chambres: int = 0
    nb_sdb: int = 0
    dpe_classe: Optional[str] = None
    score_completude: float = 0
    decision: int = 4
    fit_fonctionnel: str = ""
    fit_emotionnel: str = ""
    intentions: dict = {}
    niveau_confiance: str = "FAIBLE"
    version: str = "1.0"
    created_at: str = ""


class PipelineResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None
