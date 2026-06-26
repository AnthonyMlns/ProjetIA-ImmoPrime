# UPRE RBAC Matrix

Matrice d'acces appliquee a toutes les sorties du pipeline UPRE.

## Niveaux d'acces

### Niveau 0 — Public
Peut voir:
- Vignettes anonymisees (pas d'adresse exacte, pas de prix, pas de nom vendeur, pas de photo localisante)
- Contenus editoriaux publics UPRE

Ne peut PAS voir:
- Note d'Actif
- Asset Briefing
- Adresse
- Prix
- Photos interieures
- Plans
- Identite du vendeur

### Niveau 1 — Acquereur qualifie (apres qualification)
Peut voir:
- Vignette
- Note d'Actif anonymisee (sans adresse, sans prix, sans nom vendeur)
- Synthese Fit fonctionnel / emotionnel

Ne peut PAS voir sans NDA:
- Adresse exacte
- Prix
- Plans detailles
- DPE/DDT complets
- Identite vendeur
- Asset Briefing complet

### Niveau 2 — Prescripteur / Family Office qualifie
Peut voir:
- Vignette
- Note d'Actif
- Asset Briefing anonymise (sans adresse exacte ni nom vendeur)

Ne peut PAS voir sans NDA:
- Adresse exacte
- Identite vendeur
- Documents legaux (DPE, DDT, copropriete)

### Niveau 3 — Apres NDA signe
Peut voir:
- Tous les documents
- Adresse exacte
- Prix
- Plans
- Diagnostics complets

### Niveau 4 — Mandataire proprietaire de l'actif
Peut voir:
- Tout

### Niveau 5 — Admin UPRE
Peut voir:
- Tout
- Logs d'acces
- Historique de l'actif
- Donnees de tous les actifs

## Regle de filtrage

Avant toute generation de document pour un tiers, appliquer:
1. Identifier le niveau du destinataire
2. Filtrer les champs selon la matrice
3. Marquer les champs filtres comme "[INFORMATION PROTEGEE — NDA requis]"

## Regle de progression

Un acquereur ne peut monter de niveau QUE si:
- Niveau 0→1: Qualification par l'Agent Relationnel (credibilite, maturite, interet reel)
- Niveau 1→2: Validation humaine UPRE + historique d'interet documente
- Niveau 2→3: NDA signe + validation humaine UPRE
