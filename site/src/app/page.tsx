import Image from "next/image";
import Link from "next/link";
import { PropertyCard } from "@/components/property-card";
import { api } from "@/lib/api";

const BENTO_SPANS = ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-8"];

export default async function Home() {
  const assets = await api.public.listAssets().catch(() => []);
  const featured = assets.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-primary-container to-primary">
          <Image
            src="/images/saint-tropez/StTropez-exterieur-1.png"
            alt="Villa de prestige sur la Côte d'Azur"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/20" />
          <div className="absolute inset-0 luxury-gradient" />
        </div>
        <div className="relative z-10 w-full max-w-[1180px] mx-auto px-6 md:px-8">
          <div className="max-w-3xl">
            <h1 className="font-display-hero text-display-hero text-surface-container-lowest mb-8">
              L&apos;excellence immobilière, en toute discrétion
            </h1>
            <div className="bg-surface-container-lowest p-2 rounded-xl shadow-2xl flex flex-col md:flex-row items-stretch gap-2">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-muted/30">
                <div className="p-4 flex flex-col justify-center">
                  <label className="font-label-caps text-[10px] text-text-subtle uppercase mb-1">Type de Bien</label>
                  <select className="bg-transparent border-none focus:ring-0 font-body-md text-primary p-0 appearance-none cursor-pointer">
                    <option>Villas d&apos;Architecte</option>
                    <option>Penthouses</option>
                    <option>Domaines Privés</option>
                  </select>
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <label className="font-label-caps text-[10px] text-text-subtle uppercase mb-1">Localisation</label>
                  <input
                    className="bg-transparent border-none focus:ring-0 font-body-md text-primary p-0 placeholder:text-text-subtle w-full"
                    placeholder="Saint-Tropez, Cannes..."
                    type="text"
                  />
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <label className="font-label-caps text-[10px] text-text-subtle uppercase mb-1">Budget</label>
                  <select className="bg-transparent border-none focus:ring-0 font-body-md text-primary p-0 appearance-none cursor-pointer">
                    <option>Sur demande</option>
                    <option>5M€ - 15M€</option>
                    <option>15M€ +</option>
                  </select>
                </div>
              </div>
              <Link
                href="/biens"
                className="bg-primary text-on-primary px-10 py-4 font-label-caps text-label-caps uppercase flex items-center justify-center gap-3 hover:bg-primary/90 transition-all rounded-lg"
              >
                <span className="material-symbols-outlined text-xl">search</span>
                Explorer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties (Bento Grid) */}
      <section className="py-24 max-w-[1180px] mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-xl">
            <span className="font-label-caps text-label-caps text-gated-gold tracking-[0.2em] uppercase mb-4 block">
              Sélection Exclusive
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Les Demeures d&apos;Exception</h2>
          </div>
          <Link
            href="/biens"
            className="font-nav-link text-primary border-b border-primary pb-1 hover:text-gated-gold hover:border-gated-gold transition-all"
          >
            Voir tout le catalogue
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-on-surface-variant">Aucun bien publié pour le moment. Revenez bientôt.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {featured.map((asset, i) => (
              <div key={asset.id} className={BENTO_SPANS[i % BENTO_SPANS.length]}>
                <PropertyCard asset={asset} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Vendre avec UPRE */}
      <section className="py-24 bg-primary text-on-primary relative overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <span className="font-label-caps text-label-caps text-gated-gold tracking-[0.2em] uppercase mb-6 block">
              Services Sur-Mesure
            </span>
            <h2 className="font-headline-lg text-headline-lg mb-8 leading-tight">
              Vendez votre bien avec une expertise d&apos;élite
            </h2>
            <p className="font-body-lg text-body-lg text-surface-container-lowest/80 mb-10 leading-relaxed">
              Chez UPRE, nous transformons la transaction immobilière en une expérience
              de haute couture. Notre réseau international et nos outils de marketing
              confidentiels assurent à votre propriété une visibilité auprès d&apos;une
              clientèle ultra-qualifiée, tout en préservant votre intimité.
            </p>
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-gated-gold mt-1">verified_user</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Estimation Discrète</h4>
                  <p className="text-text-subtle text-sm">Analyse comparative poussée par nos experts locaux.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-gated-gold mt-1">visibility_off</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Vente Hors-Marché</h4>
                  <p className="text-text-subtle text-sm">Accès direct à notre &quot;Gated Circle&quot; d&apos;investisseurs privés.</p>
                </div>
              </div>
            </div>
            <Link
              href="/vendre"
              className="bg-gated-gold text-white px-10 py-5 font-label-caps text-label-caps uppercase tracking-[0.15em] hover:brightness-110 transition-all rounded-lg flex items-center gap-3 w-fit"
            >
              Confier un mandat
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br from-primary-container to-tertiary-container" />
            <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-8 rounded-lg shadow-xl hidden md:block max-w-[280px]">
              <p className="font-display-hero text-headline-sm text-primary mb-2">98%</p>
              <p className="text-on-surface-variant text-sm font-body-md leading-snug">
                De satisfaction client sur nos transactions hors-marché cette année.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Gated Access Promo */}
      <section className="py-16 max-w-[1180px] mx-auto px-6 md:px-8 text-center">
        <div className="bg-surface-container-low py-16 px-8 rounded-2xl border border-muted/10">
          <span className="material-symbols-outlined filled text-gated-gold text-5xl mb-6 block">lock</span>
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Rejoignez le Gated Circle</h2>
          <p className="text-text-subtle max-w-2xl mx-auto mb-10">
            Accédez à nos propriétés les plus exclusives avant leur mise sur le marché
            public. Recevez nos analyses trimestrielles sur le marché de l&apos;immobilier
            de luxe.
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input
              className="flex-1 bg-white border border-muted px-6 py-4 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Votre adresse email professionnelle"
              type="email"
            />
            <button className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps uppercase rounded-lg hover:opacity-90 transition-all">
              S&apos;inscrire
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
