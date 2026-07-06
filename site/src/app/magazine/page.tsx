import Image from "next/image";

export const metadata = {
  title: "L'Art de Vivre — Magazine UPRE",
};

const ARTICLES = [
  {
    category: "INVESTISSEMENT",
    title: "Le Marché de l'Ultra-Luxe à Saint-Tropez : Tendances 2024",
    excerpt: "Analyse exclusive des nouvelles dynamiques d'achat des grandes fortunes internationales sur la presqu'île la plus convoitée du monde.",
    image: "/images/saint-tropez/StTropez-interieur-1.png",
  },
  {
    category: "CONCIERGERIE",
    title: "L'Art de la Réception : Les Services de Conciergerie Privée",
    excerpt: "Comment transformer chaque séjour en une expérience sur-mesure inégalée, du chef étoilé à domicile à la gestion d'événements privés.",
    image: "/images/cannes/Cannes-interieur-2.png",
  },
  {
    category: "ARCHITECTURE",
    title: "Jardins Suspendus : Créer un Écrin de Verdure Architectural",
    excerpt: "L'intégration du paysage comme prolongement de la structure : les secrets des plus beaux jardins paysagers de la Côte d'Azur.",
    image: "/images/mougins/vignoble-exterieur.png",
  },
  {
    category: "LIFESTYLE",
    title: "Naviguer avec Distinction : Les Nouveaux Yachts Hybrides",
    excerpt: "Quand la haute technologie navale rencontre l'écologie sans compromis sur le raffinement et l'espace de vie à bord.",
    image: "/images/saint-tropez/StTropez-exterieur-1.png",
  },
  {
    category: "DÉCORATION",
    title: "Collectionner l'Art Contemporain en Résidence Privée",
    excerpt: "Conseils de curateurs pour intégrer des pièces d'exception dans votre intérieur tout en préservant l'harmonie de votre espace de vie.",
    image: "/images/cannes/Cannes-interieur-3.png",
  },
  {
    category: "LIFESTYLE",
    title: "Les Caves d'Exception : Le Nouveau Sanctuaire du Collectionneur",
    excerpt: "Exploration des designs de caves les plus spectaculaires, alliant conservation parfaite et mise en scène théâtrale des plus grands crus.",
    image: "/images/mougins/vignoble-interieur-2.png",
  },
];

const CATEGORIES = ["TOUS LES ARTICLES", "INVESTISSEMENT", "ARCHITECTURE", "DÉCORATION", "CONCIERGERIE"];

export default function MagazinePage() {
  const [hero, ...rest] = ARTICLES;

  return (
    <main>
      <section className="relative min-h-[600px] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <Image src={hero.image} alt={hero.title} fill sizes="100vw" priority className="object-cover" />
          <div className="absolute inset-0 luxury-gradient" />
        </div>
        <div className="relative z-10 max-w-[1180px] mx-auto w-full px-6 md:px-8 pb-24 text-white">
          <span className="font-label-caps text-label-caps text-gated-gold mb-4 block">{hero.category}</span>
          <h1 className="font-headline-lg text-headline-lg mb-6 max-w-3xl">{hero.title}</h1>
          <p className="font-body-lg text-body-lg max-w-2xl text-surface-container-high mb-8 opacity-90">{hero.excerpt}</p>
          <a className="inline-flex items-center gap-4 group" href="#">
            <span className="font-nav-link text-nav-link uppercase border-b border-white pb-1 group-hover:border-gated-gold group-hover:text-gated-gold transition-all">
              Découvrir l&apos;article
            </span>
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_forward</span>
          </a>
        </div>
      </section>

      <section className="py-8 bg-surface-container-low">
        <div className="max-w-[1180px] mx-auto px-6 md:px-8">
          <div className="flex flex-wrap justify-center gap-12 border-b border-muted pb-6">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                className={
                  i === 0
                    ? "font-label-caps text-label-caps text-primary border-b-2 border-primary pb-2"
                    : "font-label-caps text-label-caps text-text-subtle hover:text-primary transition-colors pb-2"
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-container-low">
        <div className="max-w-[1180px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rest.map((article) => (
              <article key={article.title} className="group bg-white border border-muted overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image src={article.image} alt={article.title} fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-8">
                  <span className="font-label-caps text-label-caps text-gated-gold mb-4 block">{article.category}</span>
                  <h3 className="font-title-card text-title-card text-primary mb-4">{article.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3">{article.excerpt}</p>
                  <a className="font-nav-link text-nav-link uppercase text-primary inline-flex items-center gap-2 group-hover:text-gated-gold transition-colors" href="#">
                    Lire la suite
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <button className="border border-primary px-12 py-4 font-nav-link text-nav-link uppercase text-primary hover:bg-primary hover:text-white transition-all">
              Charger plus d&apos;articles
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="max-w-[1180px] mx-auto px-6 md:px-8 relative z-10 text-center">
          <span className="font-label-caps text-label-caps text-gated-gold mb-4 block">NEWSLETTER EXCLUSIVE</span>
          <h2 className="font-headline-md text-headline-md mb-8">Le Cercle Privé</h2>
          <p className="font-body-lg text-body-lg max-w-2xl mx-auto mb-12 text-surface-container-high">
            Rejoignez une communauté de passionnés et recevez chaque mois une sélection
            confidentielle de propriétés hors-marché et d&apos;articles exclusifs sur l&apos;art de
            vivre.
          </p>
          <form className="max-w-xl mx-auto flex flex-col md:flex-row gap-4">
            <input
              className="grow bg-primary-container border border-white/10 text-white p-4 focus:ring-1 focus:ring-gated-gold focus:border-gated-gold outline-none"
              placeholder="Votre adresse email"
              type="email"
            />
            <button className="bg-gated-gold text-white px-8 py-4 font-nav-link text-nav-link uppercase hover:opacity-90 transition-all" type="submit">
              S&apos;abonner
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
