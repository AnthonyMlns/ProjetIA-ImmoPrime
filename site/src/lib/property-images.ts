/**
 * Demo photography, keyed by city, until mandataires upload real photos
 * through the pipeline (AIFData has no photo field yet).
 */
const PROPERTY_PHOTOS: Record<string, { cover: string; gallery: string[] }> = {
  "saint-tropez": {
    cover: "/images/saint-tropez/StTropez-exterieur-1.png",
    gallery: [
      "/images/saint-tropez/StTropez-exterieur-1.png",
      "/images/saint-tropez/StTropez-interieur-1.png",
      "/images/saint-tropez/StTropez-interieur-2.png",
    ],
  },
  cannes: {
    cover: "/images/cannes/Cannes-exterieur-1.png",
    gallery: [
      "/images/cannes/Cannes-exterieur-1.png",
      "/images/cannes/Cannes-interieur-1.png",
      "/images/cannes/Cannes-interieur-2.png",
      "/images/cannes/Cannes-interieur-3.png",
    ],
  },
  mougins: {
    cover: "/images/mougins/vignoble-exterieur.png",
    gallery: [
      "/images/mougins/vignoble-exterieur.png",
      "/images/mougins/vignoble-interieur-1.png",
      "/images/mougins/vignoble-interieur-2.png",
    ],
  },
  paris: {
    cover: "/images/paris/hotel-particulier-exterieur.png",
    gallery: [
      "/images/paris/hotel-particulier-exterieur.png",
      "/images/paris/hotel-particulier-interieur-1.png",
      "/images/paris/hotel-particulier-interieur-2.png",
    ],
  },
  nice: {
    cover: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18f6b0050?w=1200&q=80",
    ],
  },
  monaco: {
    cover: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    ],
  },
};

function slugify(ville: string) {
  return ville.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function getPropertyPhotos(ville: string) {
  const key = slugify(ville);
  const match = Object.keys(PROPERTY_PHOTOS).find((k) => key.includes(k));
  return match ? PROPERTY_PHOTOS[match] : null;
}
