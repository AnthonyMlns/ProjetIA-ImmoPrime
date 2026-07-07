export function SiteFooter() {
  return (
    <footer className="bg-primary text-on-primary w-full py-16 border-t border-white/10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 px-6 md:px-8 max-w-[1180px] mx-auto">
        <div className="max-w-xs">
          <div className="font-display-hero text-headline-md text-surface-container-lowest mb-6 uppercase tracking-tighter">
            UPRE
          </div>
          <p className="text-text-subtle text-sm leading-relaxed mb-8">
            L&apos;agence de référence pour l&apos;immobilier de prestige sur la
            Côte d&apos;Azur et les destinations internationales
            d&apos;exception.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full hover:bg-gated-gold transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-lg">public</span>
            </a>
            <a
              className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full hover:bg-gated-gold transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-lg">share</span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 flex-1">
          <div className="flex flex-col gap-4">
            <h5 className="font-label-caps text-label-caps text-gated-gold uppercase mb-2">
              Navigation
            </h5>
            <a className="font-body-md text-text-subtle hover:text-surface-container-lowest transition-colors" href="/biens">
              Acheter
            </a>
            <a className="font-body-md text-text-subtle hover:text-surface-container-lowest transition-colors" href="/vendre">
              Vendre
            </a>
            <a className="font-body-md text-text-subtle hover:text-surface-container-lowest transition-colors" href="/magazine">
              L&apos;Art de Vivre
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="font-label-caps text-label-caps text-gated-gold uppercase mb-2">
              Société
            </h5>
            <a className="font-body-md text-text-subtle hover:text-surface-container-lowest transition-colors" href="/a-propos">
              À Propos
            </a>
            <a className="font-body-md text-text-subtle hover:text-surface-container-lowest transition-colors" href="/contact">
              Contact
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="font-label-caps text-label-caps text-gated-gold uppercase mb-2">
              Destinations
            </h5>
            <a className="font-body-md text-text-subtle hover:text-surface-container-lowest transition-colors" href="/biens">
              Saint-Tropez
            </a>
            <a className="font-body-md text-text-subtle hover:text-surface-container-lowest transition-colors" href="/biens">
              Cannes
            </a>
            <a className="font-body-md text-text-subtle hover:text-surface-container-lowest transition-colors" href="/biens">
              Monaco
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="font-label-caps text-label-caps text-gated-gold uppercase mb-2">
              Contact
            </h5>
            <p className="font-body-md text-text-subtle">8 Avenue Montaigne, 75008 Paris</p>
            <p className="font-body-md text-text-subtle">+33 (0) 1 45 67 89 00</p>
          </div>
        </div>
      </div>
      <div className="max-w-[1180px] mx-auto px-6 md:px-8 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-legal text-legal text-text-subtle">
          © {new Date().getFullYear()} UPRE Luxury Real Estate. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a className="font-legal text-legal text-text-subtle hover:text-surface-container-lowest transition-colors" href="#">
            Mentions Légales
          </a>
          <a className="font-legal text-legal text-text-subtle hover:text-surface-container-lowest transition-colors" href="#">
            Politique de Confidentialité
          </a>
          <a className="font-legal text-legal text-text-subtle hover:text-surface-container-lowest transition-colors" href="#">
            Presse
          </a>
        </div>
      </div>
    </footer>
  );
}
