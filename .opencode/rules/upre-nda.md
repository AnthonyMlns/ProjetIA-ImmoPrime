# UPRE NDA Rules

Regles de gestion du Non-Disclosure Agreement et de la revelation progressive.

## Principe general

L'information sur un actif off-market ou confidentiel est revelee par paliers.
Chaque palier est conditionne par une verification formelle.

## Paliers de revelation

### Palier 1 — Teaser / Vignette
- Visible sans NDA
- Contenu: typologie, ville/quartier (pas d'adresse), surface approximative, intention dominante, photo hero anonymisee
- Doit contenir un appel a qualification ("Interesse ? Qualifiez votre intention.")

### Palier 2 — Note d'Actif
- Visible apres qualification (Acquereur qualifie ou Prescripteur)
- Contenu: description detaillee, fit fonctionnel et emotionnel, rarefe, usages possibles, photos, plans simplifies
- Sans adresse exacte, sans prix, sans nom du vendeur

### Palier 3 — Asset Briefing
- Visible apres NDA signe
- Contenu: adresse exacte, prix, plans detailles, DPE/DDT complets, documents juridiques, historique, donnees financieres
- Watermark avec identifiant du destinataire

### Palier 4 — Dossier complet
- Visible en salle de donnees ou sur validation humaine UPRE
- Contenu: tous les documents, rapport complet, elements de negociation

## Regles NDA

1. Un NDA doit etre signe avant tout acces au Palier 3.
2. L'Agent NE prepare PAS le NDA automatiquement — il signale "NDA_REQUIS" et le workflow humain prend le relais.
3. Les documents transmis apres NDA doivent etre watermarkes avec:
   - Nom / entite du destinataire
   - Date de transmission
   - Mention "CONFIDENTIEL — UPRE"
   - Identifiant unique de tracabilite
4. Toute demande de NDA ou de Palier 3 doit etre loggee (qui, quand, quel actif).
5. Le partage de documents apres NDA doit etre tracable (qui a recu quoi, quand).
6. Si le NDA est refuse ou expire, l'acces au Palier 3 est immediatement retire.

## Detection dans les sources

Lors de l'ingestion d'une fiche R1 ou d'un document mandataire, detecter les mentions:
- "off-market" / "off market"
- "confidentiel" / "confidential"
- "non diffusable" / "non-diffusable"
- "sous NDA" / "under NDA"
- "ne pas divulguer"

Si l'une de ces mentions est trouvee, le statut de diffusion par defaut est "CONFIDENTIEL" et le niveau de protection maximal est applique.
