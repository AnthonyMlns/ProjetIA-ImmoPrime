import Image from "next/image";
import Link from "next/link";
import type { PublicVignette } from "@/lib/api";
import { getPropertyPhotos } from "@/lib/property-images";

function formatPrix(prix: number | null) {
  if (!prix) return "Sur Demande";
  return `${prix.toLocaleString("fr-FR")} €`;
}

function PropertyImage({ ville, alt, className = "" }: { ville: string; alt: string; className?: string }) {
  const photos = getPropertyPhotos(ville);
  if (photos) {
    return (
      <Image
        src={photos.cover}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div className={`w-full h-full bg-gradient-to-br from-primary-container to-primary flex items-center justify-center ${className}`}>
      <span className="font-display-hero text-surface-container-lowest/30 text-2xl">UPRE</span>
    </div>
  );
}

export function PropertyCard({ asset }: { asset: PublicVignette }) {
  if (asset.gated) {
    return (
      <article className="property-card-hover group bg-surface-container-lowest border border-muted/30 rounded-xl overflow-hidden shadow-sm relative">
        <div className="relative aspect-[4/3] overflow-hidden">
          <PropertyImage ville={asset.ville} alt={asset.typologie} className="property-image transition-transform duration-700" />
          <div className="absolute inset-0 gated-blur bg-black/10 flex flex-col items-center justify-center p-8 text-center transition-all duration-500 group-hover:bg-black/20">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30">
              <span className="material-symbols-outlined filled text-gated-gold text-3xl">lock</span>
            </div>
            <span className="font-label-caps text-label-caps text-white uppercase tracking-widest mb-2">
              Contenu Exclusif
            </span>
            <h3 className="font-title-card text-title-card text-white mb-4">{asset.typologie}</h3>
            <Link
              href={`/biens/${asset.id}`}
              className="bg-gated-gold text-white px-6 py-3 font-label-caps text-[11px] uppercase rounded shadow-lg hover:scale-105 transition-all inline-block"
            >
              Accès Confidentiel
            </Link>
          </div>
        </div>
        <div className="p-6 opacity-40 grayscale-[50%] pointer-events-none">
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-title-card text-title-card text-primary">•••••••••••••</h2>
            <span className="font-label-caps text-gated-gold">Prix sur demande</span>
          </div>
          <p className="font-body-md text-on-surface-variant flex items-center gap-1 mb-4">
            <span className="material-symbols-outlined text-sm">location_on</span> {asset.ville}
          </p>
          <div className="flex items-center gap-4 border-t border-muted pt-4">
            <div className="flex items-center gap-1 text-sm font-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">square_foot</span> ---
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <Link href={`/biens/${asset.id}`} className="block group">
      <article className="property-card-hover bg-surface-container-lowest border border-muted/30 rounded-xl overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-primary font-label-caps px-3 py-1 text-[10px] uppercase">
              Exclusivité
            </span>
          </div>
          <PropertyImage ville={asset.ville} alt={asset.typologie} className="property-image transition-transform duration-700" />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-title-card text-title-card text-primary">{asset.typologie}</h2>
            <span className="font-label-caps text-gated-gold whitespace-nowrap">{formatPrix(asset.prix)}</span>
          </div>
          <p className="font-body-md text-on-surface-variant flex items-center gap-1 mb-4">
            <span className="material-symbols-outlined text-sm">location_on</span> {asset.ville}
          </p>
          <div className="flex items-center gap-4 border-t border-muted pt-4">
            <div className="flex items-center gap-1 text-sm font-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">square_foot</span> {asset.surface_habitable.toFixed(0)}m²
            </div>
            <div className="flex items-center gap-1 text-sm font-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">bed</span> {asset.nb_chambres}
            </div>
            <div className="flex items-center gap-1 text-sm font-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">bathtub</span> {asset.nb_sdb}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
