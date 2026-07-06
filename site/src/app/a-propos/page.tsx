import Image from "next/image";

export const metadata = {
  title: "L'Esprit UPRE — À Propos",
};

const LEADERSHIP = [
  { name: "Elena de Valmont", role: "Présidente Fondatrice" },
  { name: "Julian S. Arnault", role: "Directeur International" },
  { name: "Sophie Laroche", role: "Directrice de la Stratégie" },
];

export default function AProposPage() {
  return (
    <main>
      <section className="relative h-[500px] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cannes/Cannes-interieur-1.png"
            alt="Bureau UPRE"
            fill
            sizes="100vw"
            priority
            className="object-cover grayscale opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/40" />
        </div>
        <div className="relative z-10 max-w-[1180px] mx-auto w-full px-6 md:px-8 pb-24">
          <span className="font-label-caps text-label-caps text-secondary mb-4 block">DEPUIS 1984</span>
          <h1 className="font-display-hero text-display-hero text-primary max-w-3xl">
            L&apos;Excellence comme unique Horizon.
          </h1>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-[1180px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5">
            <h2 className="font-headline-md text-headline-md text-primary mb-8">Notre ADN</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
              Fondée sur les rives de la Méditerranée, la Maison UPRE s&apos;est imposée comme la
              référence absolue de l&apos;immobilier de prestige. Plus qu&apos;une agence, nous
              sommes les gardiens d&apos;un art de vivre où chaque transaction est traitée avec la
              minutie d&apos;un orfèvre.
            </p>
            <div className="h-px w-16 bg-muted mb-6" />
            <blockquote className="font-headline-sm text-headline-sm italic text-secondary">
              &quot;Nous ne vendons pas des propriétés, nous transmettons des patrimoines
              d&apos;exception.&quot;
            </blockquote>
          </div>
          <div className="md:col-span-6 md:col-start-8">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative">
              <Image src="/images/mougins/vignoble-interieur-1.png" alt="Notre maison" fill sizes="40vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-container-low">
        <div className="max-w-[1180px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white p-12 rounded-xl border border-muted shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-4xl text-gated-gold">analytics</span>
                <h3 className="font-headline-sm text-headline-sm text-primary">L&apos;Expertise du Marché</h3>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Nos analystes scrutent quotidiennement les fluctuations du marché mondial pour
                offrir à nos clients une vision prédictive. L&apos;intelligence immobilière UPRE
                repose sur quarante ans de données exclusives et une compréhension fine des actifs
                tangibles.
              </p>
            </div>
            <div className="mt-12 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-primary">12.4B€</span>
                <span className="font-label-caps text-label-caps text-text-subtle">ACTIFS GÉRÉS</span>
              </div>
              <div className="w-px h-12 bg-muted" />
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-primary">150+</span>
                <span className="font-label-caps text-label-caps text-text-subtle">EXPERTS DÉDIÉS</span>
              </div>
            </div>
          </div>
          <div className="bg-primary text-on-primary p-12 rounded-xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <h3 className="font-headline-sm text-headline-sm mb-6">Réseau International</h3>
              <p className="font-body-md text-body-md opacity-80 leading-relaxed">
                De Saint-Tropez à Aspen, de Dubaï à New York, notre réseau interconnecte les
                enclaves les plus exclusives de la planète.
              </p>
            </div>
            <a className="flex items-center gap-2 font-label-caps text-label-caps text-secondary-container hover:gap-4 transition-all" href="/contact">
              DÉCOUVRIR NOS BUREAUX <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-[1180px] mx-auto px-6 md:px-8 text-center mb-16">
          <span className="font-label-caps text-label-caps text-secondary">GOUVERNANCE</span>
          <h2 className="font-headline-lg text-headline-lg text-primary mt-4">La Direction</h2>
        </div>
        <div className="max-w-[1180px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {LEADERSHIP.map((person) => (
            <div key={person.name}>
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-6 bg-gradient-to-br from-primary-container to-primary" />
              <h4 className="font-title-card text-title-card text-primary">{person.name}</h4>
              <p className="font-label-caps text-label-caps text-text-subtle mt-1 uppercase">{person.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-primary-container relative overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-on-primary">
            <div className="flex items-center gap-4 mb-6">
              <span className="material-symbols-outlined filled text-3xl text-gated-gold">lock</span>
              <span className="font-label-caps text-label-caps text-gated-gold">ENGAGEMENT DE CONFIDENTIALITÉ</span>
            </div>
            <h2 className="font-headline-md text-headline-md mb-8">Le Silence est le vrai Luxe</h2>
            <p className="font-body-lg text-body-lg opacity-80 leading-relaxed mb-8">
              La discrétion est la pierre angulaire de notre maison. Nous opérons une large partie
              de nos transactions en &quot;Off-Market&quot;, garantissant à nos acquéreurs et
              vendeurs un anonymat total et une sécurité transactionnelle sans faille.
            </p>
            <a href="/contact" className="inline-block bg-secondary text-white font-label-caps text-label-caps px-8 py-4 hover:bg-gated-gold transition-colors">
              CONSULTER NOTRE CHARTE ÉTHIQUE
            </a>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/5 backdrop-blur-md p-10 border border-white/10 rounded-xl">
              <div className="flex flex-col gap-6">
                {[
                  { icon: "verified_user", title: "Protection des Données", text: "Protocoles de cryptage de niveau bancaire pour chaque dossier." },
                  { icon: "visibility_off", title: "Anonymat Garanti", text: "Gestion de mandats sous prête-nom et structures dédiées." },
                  { icon: "gavel", title: "Conseil Juridique", text: "Accompagnement par des cabinets d'avocats internationaux." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="material-symbols-outlined text-gated-gold">{item.icon}</span>
                    <div>
                      <h5 className="font-bold text-white mb-1">{item.title}</h5>
                      <p className="text-white/60 text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
