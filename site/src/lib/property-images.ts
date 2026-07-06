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
};

function slugify(ville: string) {
  return ville.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function getPropertyPhotos(ville: string) {
  const key = slugify(ville);
  const match = Object.keys(PROPERTY_PHOTOS).find((k) => key.includes(k));
  return match ? PROPERTY_PHOTOS[match] : null;
}
