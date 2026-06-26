"""
UPRE Sanitizer — Anti-prompt-injection & data cleanup.
"""

import re

INJECTION_PATTERNS = [
    r"(?i)ignore\s+(all\s+)?(previous|above|toutes\s+les|prior|les|mes)?\s*(instructions|regles|consignes|directives|prompts?)",
    r"(?i)(system|nouveau)\s*prompt\s*:",
    r"(?i)you\s+are\s+now\s+(a|an|the)",
    r"(?i)(forget|oublie)\s+(everything|tout|toutes?\s+les\s+consignes)",
    r"(?i)(affiche|reveal|divulgue|montre|envoie|send|show|disclose|display)\s.*\b(data|prompt|system|hidden|secret|actifs?|opportunit|donn[eé]es?|informations?)\b",
    r"(?i)what\s+are\s+your\s+(instructions|prompts|rules|directives)",
    r"(?i)quelles?\s+sont\s+(tes|vos)\s+(instructions|regles|consignes)",
    r"(?i)d[eé]sactive\s+(le|la|les)?\s*(nda|confidentialit[eé]|protection|s[eé]curit[eé]|filtre)",
    r"(?i)(disable|bypass|deactivate|override)\s+(the\s+)?(nda|confidentiality|protection|security|filter|gate)",
    r"(?i)tu\s+(n[' ]es?|n[' ]est)\s+plus\s+(un\s+)?employ[eé].*upre",
    r"(?i)you\s+are\s+(no\s+longer|not)\s+(an\s+)?upre\s+employee",
    r"(?i)print\s*\(.*prompt",
    r"(?i)---\s*END\s*OF\s*INSTRUCTIONS",
    r"(?i)acting\s+as\s+(a\s+)?(hacker|unrestricted|unfiltered|jailbreak)",
    r"(?i)(ignore|oublie|forget|skip)\s+.*\b(r[oô]le|contexte|mission|t[aâ]che)\b",
    r"(?i)(tu\s+es|you\s+are)\s+(maintenant|now|d[eé]sormais)\s+(un|a)\s+(hacker|pirate|attacker)",
    r"(?i)(ne\s+respecte\s+pas|do\s+not\s+follow)\s+(les?\s+)?(regles?|consignes?|instructions?)",
    r"(?i)dont\s+(follow|obey|respect)\s+(rules?|instructions?|guidelines?)",
]

PII_PATTERNS = {
    "email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
    "phone_fr": r"(?:(?:\+33|0)\s*[1-9])(?:[\s.-]*\d{2}){4}",
}

CONFIDENTIAL_KEYWORDS = [
    "off-market", "off market", "confidentiel", "confidential",
    "nda", "non diffusable", "non-diffusable", "sous nda", "under nda",
]


def sanitize(text: str) -> dict:
    alerts = []
    blocked = False

    if not text or not isinstance(text, str):
        return {"clean": "", "alerts": ["EMPTY_OR_INVALID_INPUT"], "blocked": True}

    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, text):
            alerts.append(f"INJECTION_DETECTED")
            blocked = True

    if blocked:
        return {
            "clean": "[CONTENU BLOQUE — tentative d'injection detectee]",
            "alerts": alerts,
            "blocked": True,
        }

    clean = text
    for label, pattern in PII_PATTERNS.items():
        if re.search(pattern, clean):
            alerts.append(f"PII_DETECTED: {label}")
            clean = re.sub(pattern, "[DONNEE PERSONNELLE MASQUEE]", clean)

    for kw in CONFIDENTIAL_KEYWORDS:
        if kw.lower() in text.lower():
            alerts.append(f"CONFIDENTIAL_TERM: '{kw}'")

    return {"clean": clean, "alerts": alerts, "blocked": False}
