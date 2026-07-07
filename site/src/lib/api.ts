const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api";

async function request<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE}${url}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export interface PublicVignette {
  id: string;
  typologie: string;
  ville: string;
  surface_habitable: number;
  nb_pieces: number;
  nb_chambres: number;
  nb_sdb: number;
  dpe_classe: string | null;
  prix: number | null;
  gated: boolean;
  photos: string[];
  fit_fonctionnel?: string;
  fit_emotionnel?: string;
}

export interface PublicStats {
  mandats_actifs: number;
  public_listings: number;
  gated_access: number;
  portfolio_value: number;
}

export const api = {
  public: {
    listAssets: () => request<PublicVignette[]>("/public/assets"),
    getAsset: (id: string) => request<PublicVignette>(`/public/assets/${id}`),
    stats: () => request<PublicStats>("/public/stats"),
  },
};
