import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { getPropertyPhotos } from "@/lib/property-images";

function formatPrix(prix: number | null) {
  if (!prix) return "Sur demande";
  return `${prix.toLocaleString("fr-FR")} €`;
}

export default async function BienDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = await api.public.getAsset(id).catch(() => null);

  if (!asset || "error" in asset) notFound();

  const photos: string[] = asset.photos?.length > 0
    ? asset.photos
    : (() => { const p = getPropertyPhotos(asset.ville); return p ? [p.cover, ...p.gallery] : []; })();

  return (
    <main>
      {/* Hero Gallery */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-8 mt-8">
        <div className="grid grid-cols-12 gap-4 h-[500px] md:h-[600px]">
          <div className="col-span-12 md:col-span-8 h-full relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-container to-primary flex items-center justify-center">
            {photos.length > 0 ? (
              <Image src={photos[0]} alt={asset.typologie} fill sizes="66vw" className="object-cover" priority />
            ) : (
              <span className="font-display-hero text-surface-container-lowest/30 text-3xl">UPRE</span>
            )}
          </div>
          <div className="hidden md:flex col-span-4 flex-col gap-4 h-full">
            <div className="h-1/2 relative rounded-lg bg-gradient-to-br from-primary to-primary-container overflow-hidden">
              {photos.length > 1 && (
                <Image src={photos[1]} alt={asset.typologie} fill sizes="33vw" className="object-cover" />
              )}
            </div>
            <div className="h-1/2 relative rounded-lg bg-gradient-to-br from-primary-container to-primary flex items-center justify-center overflow-hidden">
              {photos.length > 2 && (
                <Image src={photos[2]} alt={asset.typologie} fill sizes="33vw" className="object-cover" />
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="text-white/90 font-label-caps text-label-caps border border-white/40 px-4 py-2">
                  Galerie complète
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Title & Specs */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 font-label-caps text-label-caps rounded-full">
                {asset.gated ? "Off-Market" : "Exclusivité UPRE"}
              </span>
              <span className="text-text-subtle font-label-caps text-label-caps">Réf: {asset.id}</span>
            </div>
            <h1 className="font-display-hero text-display-hero mb-6">
              {asset.typologie}, {asset.ville}
            </h1>
            <div className="flex flex-wrap gap-12 border-y border-muted/30 py-8 mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gated-gold text-3xl">home</span>
                <div>
                  <p className="font-label-caps text-label-caps text-text-subtle uppercase">Surface</p>
                  <p className="font-title-card text-title-card">{asset.surface_habitable.toFixed(0)} m²</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gated-gold text-3xl">bed</span>
                <div>
                  <p className="font-label-caps text-label-caps text-text-subtle uppercase">Chambres</p>
                  <p className="font-title-card text-title-card">{asset.nb_chambres}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gated-gold text-3xl">bathtub</span>
                <div>
                  <p className="font-label-caps text-label-caps text-text-subtle uppercase">Salles de bain</p>
                  <p className="font-title-card text-title-card">{asset.nb_sdb}</p>
                </div>
              </div>
              {asset.dpe_classe && (
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gated-gold text-3xl">bolt</span>
                  <div>
                    <p className="font-label-caps text-label-caps text-text-subtle uppercase">DPE</p>
                    <p className="font-title-card text-title-card">{asset.dpe_classe}</p>
                  </div>
                </div>
              )}
            </div>

            {!asset.gated && (asset.fit_fonctionnel || asset.fit_emotionnel) && (
              <div className="space-y-6 mb-12">
                {asset.fit_emotionnel && (
                  <p className="font-headline-sm text-headline-sm text-primary italic leading-relaxed">
                    &quot;{asset.fit_emotionnel}&quot;
                  </p>
                )}
                {asset.fit_fonctionnel && (
                  <p className="font-body-lg text-body-lg text-on-surface-variant">{asset.fit_fonctionnel}</p>
                )}
              </div>
            )}

            {/* Gated Dossier Section */}
            <div className="mt-12 p-1 bg-gradient-to-tr from-gated-gold/30 to-transparent rounded-lg">
              <div className="bg-surface-container-lowest p-8 rounded-lg relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-title-card text-title-card text-primary">Dossier de Vente Confidentiel</h3>
                  <span className="material-symbols-outlined filled text-gated-gold">lock</span>
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  {/* Decorative backdrop, purely visual — sized to match the overlay below */}
                  <div className="absolute inset-0 grid grid-cols-2 gap-4 p-6 opacity-30 select-none blur-sm pointer-events-none">
                    <div className="space-y-4">
                      <div className="h-4 bg-muted/40 w-3/4 rounded" />
                      <div className="h-4 bg-muted/40 w-full rounded" />
                      <div className="h-4 bg-muted/40 w-1/2 rounded" />
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="h-10 border border-muted/20 rounded" />
                        <div className="h-10 border border-muted/20 rounded" />
                      </div>
                    </div>
                  </div>
                  {/* In normal flow so its own content (icon, text, button) sets the box height */}
                  <div className="relative gated-overlay flex flex-col items-center justify-center text-center p-6 min-h-[220px]">
                    <span className="material-symbols-outlined filled text-4xl text-gated-gold mb-4">verified_user</span>
                    <p className="font-label-caps text-label-caps tracking-widest text-primary mb-2">ACCÈS PRIVILÉGIÉ</p>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-xs">
                      Le plan cadastral, les rapports techniques et les revenus locatifs sont
                      réservés aux membres vérifiés.
                    </p>
                    <Link
                      href={`/contact?bien=${encodeURIComponent(asset.id)}&intention=achat`}
                      className="bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps uppercase rounded-sm hover:bg-primary-container transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">key</span> Demander l&apos;accès
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Contact Sidebar */}
          <aside className="col-span-12 md:col-span-4 sticky top-28">
            <div className="bg-white border border-muted/20 p-8 shadow-sm rounded-lg">
              <div className="mb-8">
                <p className="font-label-caps text-label-caps text-text-subtle mb-1 uppercase">Prix de présentation</p>
                <h2 className="font-headline-md text-headline-md text-primary">{formatPrix(asset.prix)}</h2>
              </div>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface uppercase block">Nom complet</label>
                  <input
                    className="w-full bg-surface-container-low border border-muted/40 focus:border-primary focus:ring-0 px-4 py-3 font-body-md"
                    placeholder="Jean Dupont"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface uppercase block">Email</label>
                  <input
                    className="w-full bg-surface-container-low border border-muted/40 focus:border-primary focus:ring-0 px-4 py-3 font-body-md"
                    placeholder="contact@luxury.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface uppercase block">Message</label>
                  <textarea
                    className="w-full bg-surface-container-low border border-muted/40 focus:border-primary focus:ring-0 px-4 py-3 font-body-md h-32 resize-none"
                    placeholder="Je souhaite organiser une visite privée..."
                  />
                </div>
                <button className="w-full bg-gated-gold text-on-primary py-4 font-label-caps text-label-caps tracking-widest uppercase hover:bg-secondary transition-colors">
                  Demander une visite privée
                </button>
              </form>
            </div>
            <div className="mt-8 flex gap-4">
              <button className="flex-1 border border-muted/40 py-3 font-label-caps text-label-caps uppercase flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-sm">share</span> Partager
              </button>
              <button className="flex-1 border border-muted/40 py-3 font-label-caps text-label-caps uppercase flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span> Brochure
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* Signature Amenities */}
      <section className="bg-primary py-24 text-on-primary">
        <div className="max-w-[1180px] mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <p className="font-label-caps text-label-caps text-gated-gold tracking-widest uppercase mb-4">L&apos;Art de Vivre</p>
            <h2 className="font-headline-lg text-headline-lg">Équipements de Prestige</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: "wine_bar", title: "Cave de Dégustation", text: "Une cave climatisée pouvant accueillir jusqu'à 1 200 crus d'exception." },
              { icon: "fitness_center", title: "Espace Fitness & Spa", text: "Salle de sport, hammam en mosaïque et salle de massage." },
              { icon: "security", title: "Sécurité Intégrale", text: "Système de domotique et surveillance périmétrique 24/7." },
            ].map((item) => (
              <div key={item.title} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 border border-gated-gold/30 flex items-center justify-center group-hover:bg-gated-gold transition-colors duration-500">
                  <span className="material-symbols-outlined text-gated-gold group-hover:text-primary transition-colors">
                    {item.icon}
                  </span>
                </div>
                <h3 className="font-title-card text-title-card mb-3">{item.title}</h3>
                <p className="font-body-md text-on-primary/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
