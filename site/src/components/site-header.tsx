import Link from "next/link";

const BACKOFFICE_URL = process.env.NEXT_PUBLIC_BACKOFFICE_URL ?? "http://localhost:3000";

const NAV_LINKS = [
  { href: "/biens", label: "Acheter" },
  { href: "/vendre", label: "Vendre" },
  { href: "/biens", label: "Villas de Prestige" },
  { href: "/magazine", label: "L'Art de Vivre" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-glass-nav backdrop-blur-md border-b border-muted/20 shadow-sm h-20">
      <div className="flex justify-between items-center h-full px-6 md:px-8 max-w-[1180px] mx-auto">
        <Link href="/" className="font-display-hero text-headline-sm tracking-tighter text-primary">
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
        {/* Deliberately understated — mandataires know where to find it, buyers don't need it in their face. */}
        <a
          href={BACKOFFICE_URL}
          className="font-nav-link text-[12px] uppercase tracking-widest text-text-subtle hover:text-primary transition-colors"
        >
          Accès Mandataire
        </a>
      </div>
    </header>
  );
}
