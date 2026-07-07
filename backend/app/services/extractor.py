"""Content extractor — PDF, DOCX, TXT."""

from pathlib import Path

import pdfplumber
from docx import Document


def extract_content(filepath: Path) -> str:
    ext = filepath.suffix.lower()

    if ext == ".pdf":
        return _read_pdf(filepath)
    elif ext in (".docx", ".doc"):
        return _read_docx(filepath)
    elif ext in (".txt", ".md"):
        return _read_txt(filepath)
    else:
        return ""


def _read_pdf(filepath: Path) -> str:
    parts = []
    try:
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    parts.append(t)
    except Exception:
        return ""
    return "\n\n".join(parts)


def _read_docx(filepath: Path) -> str:
    try:
        doc = Document(str(filepath))
        return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    except Exception:
        return ""


def _read_txt(filepath: Path) -> str:
    for enc in ("utf-8", "latin-1", "cp1252"):
        try:
            return filepath.read_text(encoding=enc)
        except UnicodeDecodeError:
            continue
    return ""
