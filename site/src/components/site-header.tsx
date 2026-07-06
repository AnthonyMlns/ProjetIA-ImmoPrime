"use client";

import Link from "next/link";
import { useState } from "react";

const BACKOFFICE_URL = process.env.NEXT_PUBLIC_BACKOFFICE_URL ?? "http://localhost:3000";

const NAV_LINKS = [
  { href: "/biens", label: "Acheter" },
  { href: "/vendre", label: "Vendre" },
  { href: "/magazine", label: "L'Art de Vivre" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-glass-nav backdrop-blur-md border-b border-muted/20 shadow-sm">
      <div className="flex justify-between items-center h-20 px-6 md:px-8 max-w-[1180px] mx-auto">
        <Link href="/" className="font-display-hero text-headline-sm tracking-tighter text-primary" onClick={() => setMenuOpen(false)}>
          UPRE
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-nav-link text-nav-link uppercase text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {/* Deliberately understated — mandataires know where to find it, buyers don't need it in their face. */}
          <a
            href={BACKOFFICE_URL}
            className="hidden sm:inline font-nav-link text-[12px] uppercase tracking-widest text-text-subtle hover:text-primary transition-colors"
          >
            Accès Mandataire
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            className="md:hidden text-primary"
          >
            <span className="material-symbols-outlined text-2xl">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-glass-nav backdrop-blur-md border-t border-muted/20 px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-nav-link text-nav-link uppercase text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={BACKOFFICE_URL}
            className="font-nav-link text-[12px] uppercase tracking-widest text-text-subtle hover:text-primary transition-colors pt-2 border-t border-muted/20"
          >
            Accès Mandataire
          </a>
        </nav>
      )}
    </header>
  );
}
