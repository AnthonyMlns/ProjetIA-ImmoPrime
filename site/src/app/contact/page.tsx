export const metadata = {
  title: "Contact — UPRE",
};

const OFFICES = [
  {
    city: "Saint-Tropez",
    tag: "Siège Historique",
    address: "12 Place des Lices, 83990 Saint-Tropez",
    hours: "09:00 — 19:00 (Lun - Sam)",
    phone: "+33 (0)4 94 00 00 00",
  },
  {
    city: "Cannes",
    address: "45 Boulevard de la Croisette, 06400 Cannes",
    hours: "10:00 — 18:30 (Lun - Ven)",
    phone: "+33 (0)4 93 00 00 00",
  },
  {
    city: "Monaco",
    address: "2 Avenue d'Ostende, 98000 Monaco",
    hours: "09:30 — 18:00 (Lun - Ven)",
    phone: "+377 97 00 00 00",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ bien?: string; intention?: string }>;
}) {
  const { bien } = await searchParams;

  return (
    <main>
      <header className="pt-20 pb-20 px-6 md:px-8 max-w-[1180px] mx-auto text-center">
        <span className="font-label-caps text-label-caps text-gated-gold mb-4 block">EXCELLENCE À VOTRE SERVICE</span>
        <h1 className="font-headline-lg text-headline-lg text-primary mb-6">Contactez votre conciergerie</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Nos experts vous accompagnent dans la réalisation de vos projets immobiliers les plus
          ambitieux sur la Côte d&apos;Azur.
        </p>
        {bien && (
          <p className="mt-6 inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 font-label-caps text-[12px] uppercase rounded-full">
            <span className="material-symbols-outlined text-base">lock</span>
            Demande d&apos;accès confidentiel — Réf. {bien}
          </p>
        )}
      </header>

      <div className="px-6 md:px-8 max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">
        <section className="lg:col-span-5 flex flex-col gap-10">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-8">Nos Bureaux</h2>
            <div className="space-y-10">
              {OFFICES.map((office, i) => (
                <div key={office.city}>
                  <div className="flex justify-between items-baseline mb-4">
                    <h3 className="font-title-card text-title-card text-primary">{office.city}</h3>
                    {office.tag && <span className="font-label-caps text-[11px] text-gated-gold">{office.tag}</span>}
                  </div>
                  <div className="space-y-2 font-body-md text-body-md text-on-surface-variant">
                    <p>{office.address}</p>
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-gated-gold">schedule</span>
                      {office.hours}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-gated-gold">call</span>
                      {office.phone}
                    </p>
                  </div>
                  {i < OFFICES.length - 1 && <div className="w-full h-px bg-muted/50 mt-10" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary p-8 text-white relative overflow-hidden">
            <h4 className="font-title-card text-title-card mb-2">Service Conciergerie</h4>
            <p className="font-body-md text-body-md text-surface-container-lowest/70 mb-6">
              Un agent dédié est prêt à répondre à vos questions 24/7.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gated-gold text-white px-6 py-3 font-label-caps text-[13px] flex items-center gap-2 hover:brightness-110 transition-colors">
                <span className="material-symbols-outlined filled text-[20px]">phone_in_talk</span>
                Appel Immédiat
              </button>
              <button className="border border-white/20 text-white px-6 py-3 font-label-caps text-[13px] hover:bg-white/10 transition-colors">
                WhatsApp
              </button>
            </div>
          </div>
        </section>

        <section className="lg:col-span-7">
          <div className="bg-white p-8 md:p-12 shadow-sm border border-muted/30">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4">Votre Projet</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-10">
              Confiez-nous vos critères et bénéficiez d&apos;une recherche confidentielle sur-mesure.
            </p>
            <form className="space-y-8">
              <div className="space-y-4">
                <label className="font-label-caps text-label-caps text-primary">Votre Intention</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: "shopping_bag", label: "Achat" },
                    { icon: "sell", label: "Vente" },
                    { icon: "star_rate", label: "Sur-mesure" },
                  ].map((intent) => (
                    <button
                      key={intent.label}
                      type="button"
                      className="flex flex-col items-center justify-center p-6 border border-muted hover:border-primary transition-all text-center group"
                    >
                      <span className="material-symbols-outlined text-[28px] text-gated-gold mb-2">{intent.icon}</span>
                      <span className="font-label-caps text-[11px] text-primary">{intent.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-caps text-[11px] text-primary">Prénom &amp; Nom</label>
                  <input className="w-full bg-background border border-muted p-4 font-body-md text-body-md focus:outline-none focus:border-primary transition-all" placeholder="Jean Dupont" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-[11px] text-primary">Email</label>
                  <input className="w-full bg-background border border-muted p-4 font-body-md text-body-md focus:outline-none focus:border-primary transition-all" placeholder="jean@exemple.com" type="email" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-caps text-[11px] text-primary">Téléphone</label>
                  <input className="w-full bg-background border border-muted p-4 font-body-md text-body-md focus:outline-none focus:border-primary transition-all" placeholder="+33 6 00 00 00 00" type="tel" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-[11px] text-primary">Budget estimé (Optionnel)</label>
                  <select className="w-full bg-background border border-muted p-4 font-body-md text-body-md focus:outline-none focus:border-primary transition-all appearance-none">
                    <option>Indifférent</option>
                    <option>2M€ - 5M€</option>
                    <option>5M€ - 10M€</option>
                    <option>10M€+</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-[11px] text-primary">Description de votre recherche</label>
                <textarea
                  className="w-full bg-background border border-muted p-4 font-body-md text-body-md focus:outline-none focus:border-primary transition-all"
                  placeholder="Villa pied dans l'eau, minimum 5 chambres, secteur Cap d'Antibes..."
                  defaultValue={bien ? `Je souhaite obtenir l'accès confidentiel à la fiche ${bien}.` : undefined}
                  rows={5}
                />
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                <button
                  className="w-full md:w-auto bg-primary text-white px-10 py-5 font-label-caps text-[13px] tracking-[0.2em] uppercase hover:bg-primary-container transition-all"
                  type="submit"
                >
                  Envoyer la demande
                </button>
                <div className="flex items-center gap-3">
                  <span className="w-12 h-px bg-muted" />
                  <span className="font-label-caps text-[11px] text-text-subtle">OU</span>
                  <span className="w-12 h-px bg-muted" />
                </div>
                <a className="group flex items-center gap-3" href="#">
                  <div className="w-12 h-12 rounded-full border border-gated-gold flex items-center justify-center group-hover:bg-gated-gold transition-all">
                    <span className="material-symbols-outlined text-gated-gold group-hover:text-white transition-colors">calendar_month</span>
                  </div>
                  <span className="font-label-caps text-[12px] text-primary group-hover:text-gated-gold transition-colors">
                    Prendre rendez-vous
                  </span>
                </a>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
