import Link from "next/link";
import { PropertyCard } from "@/components/property-card";
import { api } from "@/lib/api";

export const metadata = {
  title: "Propriétés de Prestige — UPRE",
};

export default async function BiensPage() {
  const assets = await api.public.listAssets().catch(() => []);

  return (
    <main>
      <section className="max-w-[1180px] mx-auto px-6 md:px-8 pt-12 pb-8">
        <nav className="flex items-center gap-2 text-text-subtle font-label-caps text-label-caps uppercase mb-8">
          <Link className="hover:text-primary transition-colors" href="/">Accueil</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary">Catalogue</span>
        </nav>
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-muted pb-8">
          <div>
            <h1 className="font-headline-lg text-headline-lg mb-2">Propriétés de Prestige</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Une collection rigoureuse des domaines les plus exceptionnels, sélectionnés
              pour leur architecture et leur emplacement privilégié.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-muted text-label-caps font-label-caps uppercase hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-base">tune</span> Filtrer
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-muted text-label-caps font-label-caps uppercase hover:bg-surface-container transition-colors">
              Trier par <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-6 md:px-8 flex flex-col md:flex-row gap-12 pb-24">
        <aside className="hidden md:block w-64 shrink-0 space-y-8 sticky top-32 h-fit">
          <div>
            <h3 className="font-label-caps text-label-caps uppercase text-primary mb-4 border-b border-muted pb-2">
              Type de Bien
            </h3>
            <div className="space-y-3 font-body-md text-on-surface-variant">
              {["Villa Contemporaine", "Domaine Historique", "Appartement Vue Mer"].map((label) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer group">
                  <input className="rounded-none border-muted text-primary focus:ring-primary w-4 h-4" type="checkbox" />
                  <span className="group-hover:text-primary transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-label-caps text-label-caps uppercase text-primary mb-4 border-b border-muted pb-2">Prix</h3>
            <div className="pt-4">
              <input className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" type="range" />
              <div className="flex justify-between mt-2 font-body-md text-text-subtle text-sm">
                <span>2M €</span>
                <span>50M €+</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-primary text-on-primary rounded">
            <span className="material-symbols-outlined filled text-gated-gold mb-4 block">workspace_premium</span>
            <h4 className="font-title-card text-title-card text-lg mb-2">Off-Market</h4>
            <p className="font-body-md text-sm opacity-80 mb-4">
              Accédez à notre catalogue exclusif de propriétés confidentielles.
            </p>
            <Link
              href="/contact"
              className="w-full block text-center py-2 bg-gated-gold text-white font-label-caps text-[11px] uppercase tracking-widest hover:brightness-110 transition-all"
            >
              Demander l&apos;Accès
            </Link>
          </div>
        </aside>

        <div className="grow">
          {assets.length === 0 ? (
            <p className="text-on-surface-variant">Aucun bien publié pour le moment. Revenez bientôt.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {assets.map((asset) => (
                <PropertyCard key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
