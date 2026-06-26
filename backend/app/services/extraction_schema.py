"""
UPRE Extraction Schema — ~80 champs normalises pour le pipeline Control R1.

Organises par categorie avec type, label et priorite.
Utilise par llm_provider.py pour construire les prompts d'extraction.
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class FieldDef:
    key: str
    label: str
    category: str
    field_type: str = "string"          # string | number | list | enum
    priority: int = 1                   # 1=essentiel, 2=normal, 3=bonus
    description: str = ""
    allowed_values: Optional[list[str]] = None


SCHEMA_FIELDS: list[FieldDef] = [
    # ── Identification ──
    FieldDef("source_document", "Document source", "identification", "string", 1,
             "Nom du fichier ou référence du document source"),
    FieldDef("date_extraction", "Date d'extraction", "identification", "string", 1),

    # ── Localisation ──
    FieldDef("ville", "Ville", "localisation", "string", 1),
    FieldDef("code_postal", "Code postal", "localisation", "string", 1),
    FieldDef("adresse", "Adresse", "localisation", "string", 2,
             "Adresse complète ou partielle du bien"),
    FieldDef("quartier", "Quartier", "localisation", "string", 2),
    FieldDef("region", "Région", "localisation", "string", 2),
    FieldDef("pays", "Pays", "localisation", "string", 2, "FR par défaut"),

    # ── Typologie ──
    FieldDef("typologie", "Typologie", "typologie", "enum", 1,
             "Type de bien immobilier",
             ["appartement", "maison", "loft", "villa", "hotel_particulier",
              "immeuble", "duplex", "triplex", "studio", "penthouse",
              "propriete", "chateau", "manoir", "bastide", "mas",
              "chalet", "ferme", "moulin", "terrain"]),
    FieldDef("categorie", "Catégorie", "typologie", "enum", 2,
             "Catégorie large du bien",
             ["residentiel", "commercial", "mixte", "terrain", "exception"]),
    FieldDef("sous_categorie", "Sous-catégorie", "typologie", "string", 3),

    # ── Surfaces ──
    FieldDef("surface_habitable", "Surface habitable (m²)", "surfaces", "number", 1),
    FieldDef("surface_carrez", "Surface Carrez (m²)", "surfaces", "number", 1),
    FieldDef("surface_terrain", "Surface terrain (m²)", "surfaces", "number", 1),
    FieldDef("surface_balcon", "Surface balcon (m²)", "surfaces", "number", 3),
    FieldDef("surface_terrasse", "Surface terrasse (m²)", "surfaces", "number", 3),
    FieldDef("surface_cave", "Surface cave (m²)", "surfaces", "number", 3),
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
    FieldDef("nb_bureaux", "Nombre de bureaux", "pieces", "number", 3),
    FieldDef("nb_dressings", "Nombre de dressings", "pieces", "number", 3),
    FieldDef("nb_niveaux", "Nombre de niveaux/étages", "pieces", "number", 2),

    # ── Financier ──
    FieldDef("prix", "Prix (EUR)", "financier", "number", 1),
    FieldDef("prix_m2", "Prix au m² (EUR)", "financier", "number", 2),
    FieldDef("honoraires", "Honoraires agence", "financier", "string", 2,
             "Montant ou pourcentage des honoraires"),
    FieldDef("charges_copro", "Charges copropriété (EUR/an)", "financier", "number", 2),
    FieldDef("taxe_fonciere", "Taxe foncière (EUR/an)", "financier", "number", 2),
    FieldDef("mode_detention", "Mode de détention", "financier", "enum", 3,
             "Pleine propriété, nue-propriété, usufruit, SCI, etc.",
             ["pleine_propriete", "nue_propriete", "usufruit", "sci", "indivision", "demenbrement"]),
    FieldDef("prix_estimation", "Fourchette estimation (EUR)", "financier", "string", 3,
             "Estimation basse-haute si différente du prix affiché"),

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
    FieldDef("dpe_fiable", "DPE fiable ?", "technique", "enum", 3,
             "Estimation de la fiabilité du DPE",
             ["oui", "non", "a_verifier"]),

    # ── Années / Construction ──
    FieldDef("annee_construction", "Année de construction", "technique", "number", 1),
    FieldDef("periode_construction", "Période de construction", "technique", "enum", 2,
             "Période architecturale",
             ["avant_1850", "1850_1914", "1914_1945", "1945_1975",
              "1975_2000", "2000_2012", "post_2012", "inconnu"]),
    FieldDef("annee_renovation", "Année de rénovation", "technique", "number", 2),
    FieldDef("type_renovation", "Type de rénovation", "technique", "string", 3,
             "Complète, partielle, façade, toiture, etc."),
    FieldDef("etat_general", "État général", "technique", "enum", 1,
             "État global du bien",
             ["neuf", "tres_bon", "bon", "a_rafraichir", "a_renover", "a_rehabiliter", "vétuste"]),

    # ── Technique / Équipements ──
    FieldDef("type_chauffage", "Type de chauffage", "technique", "string", 2),
    FieldDef("type_eau_chaude", "Type eau chaude", "technique", "string", 3),
    FieldDef("climatisation", "Climatisation", "technique", "enum", 3,
             "", ["oui", "non", "partielle"]),
    FieldDef("type_vitrage", "Type de vitrage", "technique", "string", 3),
    FieldDef("norme_electrique", "Norme électrique", "technique", "string", 3,
             "Conforme, à refaire, partielle, etc."),
    FieldDef("assainissement", "Assainissement", "technique", "string", 3,
             "Tout-à-l'égout, fosse septique, micro-station, etc."),

    # ── Copropriété ──
    FieldDef("copropriete", "Copropriété", "technique", "enum", 1,
             "Bien en copropriété ?",
             ["oui", "non", "partielle"]),
    FieldDef("nb_lots", "Nombre de lots", "technique", "number", 2),
    FieldDef("procedure_copro", "Procédure en cours ?", "technique", "string", 3,
             "Description d'une éventuelle procédure copropriété en cours"),

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
    FieldDef("exposition", "Exposition principale", "confort", "string", 3,
             "Sud, Est, Ouest, Nord, croisée, etc."),
    FieldDef("vue", "Vue", "confort", "string", 3,
             "Dégagée, mer, montagne, monument, cour, rue, etc."),
    FieldDef("luminosite", "Luminosité", "confort", "string", 3),

    # ── Environnement ──
    FieldDef("transports", "Transports à proximité", "environnement", "string", 3),
    FieldDef("commerces", "Commerces à proximité", "environnement", "string", 3),
    FieldDef("ecoles", "Écoles à proximité", "environnement", "string", 3),
    FieldDef("environnement", "Environnement / quartier", "environnement", "string", 3,
             "Description qualitative de l'environnement immédiat"),

    # ── Descriptif / Texte ──
    FieldDef("description", "Descriptif complet", "descriptif", "string", 2,
             "Texte descriptif du bien — synthèse ou verbatim"),
    FieldDef("points_forts", "Points forts", "descriptif", "list", 2,
             "Liste des atouts majeurs du bien"),
    FieldDef("points_faibles", "Points faibles / vigilance", "descriptif", "list", 3,
             "Liste des défauts ou points d'attention"),

    # ── Juridique / Mandat ──
    FieldDef("mandataire", "Mandataire / Agence", "juridique", "string", 1),
    FieldDef("negociateur", "Négociateur", "juridique", "string", 3),
    FieldDef("mandat_numero", "Numéro de mandat", "juridique", "string", 1),
    FieldDef("mandat_type", "Type de mandat", "juridique", "enum", 2,
             "", ["simple", "exclusif", "semi_exclusif", "co_exclusif", "delegation"]),
    FieldDef("mandat_date", "Date du mandat", "juridique", "string", 2),
    FieldDef("mandat_duree", "Durée du mandat", "juridique", "string", 3),

    # ── Occupation / Bail ──
    FieldDef("statut_occupation", "Statut d'occupation", "juridique", "enum", 2,
             "", ["libre", "occupe", "loue", "partiellement_occupe"]),
    FieldDef("type_bail", "Type de bail", "juridique", "string", 3),
    FieldDef("loyer_actuel", "Loyer actuel (EUR/mois)", "juridique", "number", 3),
    FieldDef("preavis", "Préavis", "juridique", "string", 3),

    # ── Médias ──
    FieldDef("nb_photos", "Nombre de photos", "medias", "number", 3),
    FieldDef("nb_plans", "Nombre de plans", "medias", "number", 3),
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
