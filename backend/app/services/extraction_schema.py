"""
UPRE Extraction Schema — ~64 champs présents dans les fiches R1.

Champs extraits directement des R1 (toujours ou parfois présents).
Les champs dérivés (prix_m2, région, points_forts...) sont calculés
en post-traitement par UPRE.
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class FieldDef:
    key: str
    label: str
    category: str
    field_type: str = "string"
    priority: int = 1
    description: str = ""
    allowed_values: Optional[list[str]] = None


SCHEMA_FIELDS: list[FieldDef] = [
    # ── Localisation ──
    FieldDef("ville", "Ville", "localisation", "string", 1),
    FieldDef("code_postal", "Code postal", "localisation", "string", 1),
    FieldDef("adresse", "Adresse", "localisation", "string", 2,
             "Adresse complète ou partielle du bien"),
    FieldDef("quartier", "Quartier", "localisation", "string", 2),
    FieldDef("pays", "Pays", "localisation", "string", 2, "FR par défaut"),

    # ── Typologie ──
    FieldDef("typologie", "Typologie", "typologie", "enum", 1,
             "Type de bien immobilier",
             ["appartement", "maison", "loft", "villa", "hotel_particulier",
              "immeuble", "duplex", "triplex", "studio", "penthouse",
              "propriete", "chateau", "manoir", "bastide", "mas",
              "chalet", "ferme", "moulin", "terrain"]),

    # ── Surfaces ──
    FieldDef("surface_habitable", "Surface habitable (m²)", "surfaces", "number", 1),
    FieldDef("surface_terrain", "Surface terrain (m²)", "surfaces", "number", 1),
    FieldDef("surface_terrasse", "Surface terrasse (m²)", "surfaces", "number", 3),
    FieldDef("surface_parking", "Surface parking (m²)", "surfaces", "number", 3),
    FieldDef("surface_jardin", "Surface jardin (m²)", "surfaces", "number", 3),
    FieldDef("surface_annexe", "Surface annexe totale (m²)", "surfaces", "number", 3),

    # ── Pièces ──
    FieldDef("nb_pieces", "Nombre de pièces", "pieces", "number", 1),
    FieldDef("nb_chambres", "Nombre de chambres", "pieces", "number", 1),
    FieldDef("nb_sdb", "Salles de bain", "pieces", "number", 1),
    FieldDef("nb_sde", "Salles d'eau", "pieces", "number", 2),
    FieldDef("nb_wc", "Nombre de WC", "pieces", "number", 2),
    FieldDef("nb_cuisines", "Nombre de cuisines", "pieces", "number", 3),
    FieldDef("nb_salons", "Nombre de salons/séjours", "pieces", "number", 3),
    FieldDef("nb_dressings", "Nombre de dressings", "pieces", "number", 3),
    FieldDef("nb_niveaux", "Nombre de niveaux/étages", "pieces", "number", 2),

    # ── Financier ──
    FieldDef("prix", "Prix (EUR)", "financier", "number", 1),
    FieldDef("honoraires", "Honoraires agence", "financier", "string", 2,
             "Montant ou pourcentage des honoraires"),
    FieldDef("charges_copro", "Charges copropriété (EUR/an)", "financier", "number", 2),
    FieldDef("taxe_fonciere", "Taxe foncière (EUR/an)", "financier", "number", 2),

    # ── Technique / DPE ──
    FieldDef("dpe_classe", "DPE (classe)", "technique", "enum", 1,
             "Classe énergétique DPE",
             ["A", "B", "C", "D", "E", "F", "G", "NC"]),
    FieldDef("ges_classe", "GES (classe)", "technique", "enum", 1,
             "Classe émission GES",
             ["A", "B", "C", "D", "E", "F", "G", "NC"]),
    FieldDef("dpe_valeur", "DPE — conso énergie (kWhEP/m²/an)", "technique", "number", 2),
    FieldDef("ges_valeur", "GES — émission (kgCO2/m²/an)", "technique", "number", 2),
    FieldDef("dpe_date", "Date du DPE", "technique", "string", 3),

    # ── Construction / État ──
    FieldDef("annee_construction", "Année de construction", "technique", "number", 1),
    FieldDef("annee_renovation", "Année de rénovation", "technique", "number", 2),
    FieldDef("type_renovation", "Type de rénovation", "technique", "string", 3),
    FieldDef("etat_general", "État général", "technique", "enum", 1,
             "État global du bien",
             ["neuf", "tres_bon", "bon", "a_rafraichir", "a_renover", "a_rehabiliter", "vétuste"]),

    # ── Équipements ──
    FieldDef("type_chauffage", "Type de chauffage", "technique", "string", 2),
    FieldDef("type_eau_chaude", "Type eau chaude", "technique", "string", 3),
    FieldDef("climatisation", "Climatisation", "technique", "enum", 3,
             "", ["oui", "non", "partielle"]),
    FieldDef("type_vitrage", "Type de vitrage", "technique", "string", 3),
    FieldDef("assainissement", "Assainissement", "technique", "string", 3),

    # ── Copropriété ──
    FieldDef("copropriete", "Copropriété", "technique", "enum", 1,
             "Bien en copropriété ?",
             ["oui", "non", "partielle"]),

    # ── Étage / Immeuble ──
    FieldDef("etage", "Étage", "technique", "string", 2),
    FieldDef("nb_etages_immeuble", "Nombre d'étages immeuble", "technique", "number", 3),
    FieldDef("ascenseur", "Ascenseur", "technique", "enum", 2, "", ["oui", "non"]),

    # ── Extérieurs / Annexes ──
    FieldDef("parking", "Parking", "exterieurs", "enum", 2,
             "", ["aucun", "place", "box", "garage", "multiple"]),
    FieldDef("cave", "Cave", "exterieurs", "enum", 2, "", ["oui", "non"]),
    FieldDef("balcon", "Balcon", "exterieurs", "enum", 2, "", ["oui", "non"]),
    FieldDef("terrasse", "Terrasse", "exterieurs", "enum", 2, "", ["oui", "non"]),
    FieldDef("jardin", "Jardin", "exterieurs", "enum", 2, "", ["oui", "non"]),
    FieldDef("piscine", "Piscine", "exterieurs", "enum", 2, "", ["oui", "non"]),
    FieldDef("cheminee", "Cheminée", "exterieurs", "enum", 3, "", ["oui", "non"]),
    FieldDef("gardien", "Gardien", "exterieurs", "enum", 3, "", ["oui", "non"]),

    # ── Exposition / Vue ──
    FieldDef("exposition", "Exposition principale", "confort", "string", 3),
    FieldDef("vue", "Vue", "confort", "string", 3),
    FieldDef("luminosite", "Luminosité", "confort", "string", 3),

    # ── Environnement ──
    FieldDef("transports", "Transports à proximité", "environnement", "string", 3),
    FieldDef("commerces", "Commerces à proximité", "environnement", "string", 3),
    FieldDef("ecoles", "Écoles à proximité", "environnement", "string", 3),
    FieldDef("environnement", "Environnement / quartier", "environnement", "string", 3),

    # ── Descriptif ──
    FieldDef("description", "Descriptif complet", "descriptif", "string", 2),

    # ── Juridique / Mandat ──
    FieldDef("mandataire", "Mandataire / Agence", "juridique", "string", 1),
    FieldDef("negociateur", "Négociateur", "juridique", "string", 3),
    FieldDef("mandat_numero", "Numéro de mandat", "juridique", "string", 1),
    FieldDef("statut_occupation", "Statut d'occupation", "juridique", "enum", 2,
             "", ["libre", "occupe", "loue", "partiellement_occupe"]),

    # ── Médias ──
    FieldDef("visite_virtuelle", "Visite virtuelle disponible", "medias", "enum", 3,
             "", ["oui", "non"]),
]


def get_schema_summary() -> dict:
    """Retourne un résumé statistique du schéma."""
    categories = {}
    for f in SCHEMA_FIELDS:
        categories.setdefault(f.category, 0)
        categories[f.category] += 1
    total = len(SCHEMA_FIELDS)
    priority_counts = {1: 0, 2: 0, 3: 0}
    for f in SCHEMA_FIELDS:
        priority_counts[f.priority] += 1
    return {
        "total_fields": total,
        "categories": categories,
        "priority_counts": priority_counts,
    }
