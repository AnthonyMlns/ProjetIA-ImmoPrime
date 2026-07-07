import Image from "next/image";

export const metadata = {
  title: "Vendre votre propriété d'exception — UPRE",
};

const STEPS = [
  {
    icon: "visibility_off",
    title: "Estimation discrète",
    text: "Analyse comparative de marché approfondie et évaluation technique menée avec la plus grande confidentialité, sans exposition publique prématurée.",
  },
  {
    icon: "camera_outdoor",
    title: "Marketing de Luxe",
    text: "Production visuelle cinématographique, visites virtuelles 3D immersives et storytelling éditorial pour sublimer chaque détail architectural.",
  },
  {
    icon: "lock",
    title: "Cercle Confidentiel",
    text: "Accès immédiat à notre réseau privé d'investisseurs qualifiés et de family offices, permettant une vente \"Off-Market\" ultra-ciblée.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "L'approche Off-Market d'UPRE a été déterminante. Notre hôtel particulier a été cédé à un investisseur international en moins de trois mois, sans aucune parution publique, préservant ainsi totalement notre vie privée.",
    author: "M. et Mme de Villiers",
    role: "Propriétaires à Paris VII",
  },
  {
    quote:
      "Un marketing d'une qualité exceptionnelle. Les vidéos produites pour notre domaine de Mougins étaient dignes d'un long-métrage. L'équipe a su capturer l'âme du lieu et attirer les bons profils.",
    author: "Baron von Rothschild",
    role: "Propriétaire Domaine d'Exception",
  },
];

export default function VendrePage() {
  return (
    <main>
      <section className="relative min-h-[600px] py-32 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/mougins/vignoble-exterieur.png"
            alt="Domaine viticole de prestige à Mougins"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/40" />
        </div>
        <div className="relative z-10 max-w-[1180px] mx-auto px-6 md:px-8 w-full text-white">
          <div className="max-w-2xl">
            <span className="font-label-caps text-label-caps text-secondary-container mb-6 block">
              VOTRE PATRIMOINE, NOTRE PRIORITÉ
            </span>
            <h1 className="font-display-hero text-display-hero mb-8 leading-[1.05]">
              Discrétion absolue, Expertise d&apos;élite.
            </h1>
            <p className="font-body-lg text-body-lg mb-10 max-w-lg">
              Nous transcendons la simple transaction immobilière pour offrir un service de
              cession sur-mesure aux propriétaires les plus exigeants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="bg-primary text-white font-label-caps text-label-caps px-8 py-5 flex items-center justify-center gap-3 hover:opacity-90 transition-all"
              >
                DEMANDER UNE ESTIMATION
              </a>
              <a
                href="#steps"
                className="backdrop-blur-md bg-white/10 border border-white/30 text-white font-label-caps text-label-caps px-8 py-5 flex items-center justify-center gap-3 hover:bg-white/20 transition-all"
              >
                NOTRE PROCESSUS
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-[1180px] mx-auto px-6 md:px-8" id="steps">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <h2 className="font-headline-lg text-headline-lg text-primary">
            L&apos;Excellence au service de votre vente.
          </h2>
          <div className="flex items-center">
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Vendre une propriété de prestige demande une approche qui allie marketing de pointe
              et réseau relationnel confidentiel. Notre méthodologie en trois piliers garantit une
              valorisation optimale de votre bien.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.title} className="p-10 bg-white border border-muted group hover:shadow-lg transition-all">
              <div className="w-12 h-12 flex items-center justify-center bg-surface-container mb-8">
                <span className="material-symbols-outlined text-primary text-3xl">{step.icon}</span>
              </div>
              <h3 className="font-title-card text-title-card text-primary mb-4">{step.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">{step.text}</p>
              <div className="h-px w-full bg-muted group-hover:bg-gated-gold transition-colors" />
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-primary text-white overflow-hidden relative" id="contact">
        <div className="max-w-[1180px] mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div>
            <h2 className="font-headline-lg text-headline-lg mb-8">Initier une cession confidentielle.</h2>
            <p className="font-body-lg text-body-lg text-surface-container-high mb-12">
              Nos conseillers sont à votre disposition pour une première consultation privée. Vos
              données sont traitées avec la plus haute rigueur déontologique.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-gated-gold">call</span>
                <span className="font-body-lg">+33 (0)1 85 42 10 00</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-gated-gold">location_on</span>
                <span className="font-body-lg">Avenue Montaigne, Paris VIII</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-10 md:p-14 text-primary">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">NOM COMPLET</label>
                  <input className="w-full border-b border-muted py-3 focus:outline-none focus:border-primary bg-transparent transition-colors" placeholder="Jean Dupont" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">EMAIL PROFESSIONNEL</label>
                  <input className="w-full border-b border-muted py-3 focus:outline-none focus:border-primary bg-transparent transition-colors" placeholder="contact@email.com" type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant">TYPE DE BIEN</label>
                <select className="w-full border-b border-muted py-3 focus:outline-none focus:border-primary bg-transparent appearance-none transition-colors">
                  <option>Villa de prestige</option>
                  <option>Hôtel Particulier</option>
                  <option>Appartement d&apos;exception</option>
                  <option>Domaine viticole</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant">MESSAGE (OPTIONNEL)</label>
                <textarea
                  className="w-full border-b border-muted py-3 focus:outline-none focus:border-primary bg-transparent resize-none transition-colors"
                  placeholder="Décrivez brièvement votre projet..."
                  rows={3}
                />
              </div>
              <button className="w-full bg-primary text-white font-label-caps text-label-caps py-6 hover:bg-primary-container transition-all" type="submit">
                ENVOYER MA DEMANDE D&apos;ESTIMATION
              </button>
              <p className="text-[11px] text-on-surface-variant/60 text-center leading-relaxed">
                En soumettant ce formulaire, vous acceptez que vos données soient traitées dans le
                cadre de votre demande de cession immobilière. Confidentialité garantie par
                contrat.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-[1180px] mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <span className="font-label-caps text-label-caps text-gated-gold mb-4 block">ILS NOUS ONT FAIT CONFIANCE</span>
          <h2 className="font-headline-md text-headline-md text-primary">Témoignages de nos Vendeurs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="p-10 bg-surface-container-low border-l-4 border-gated-gold">
              <span className="material-symbols-outlined text-gated-gold text-4xl mb-6 block">format_quote</span>
              <p className="font-body-lg text-body-lg italic text-primary mb-8 leading-relaxed">&quot;{t.quote}&quot;</p>
              <p className="font-label-caps text-label-caps text-primary uppercase">{t.author}</p>
              <p className="text-on-surface-variant text-sm">{t.role}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
