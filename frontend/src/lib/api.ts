const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export interface Project {
  id: string;
  name: string;
  created: string;
  stage: number;
  files_count: number;
  assets_count: number;
  trashed: boolean;
  last_score: number | null;
  visibility: "private" | "public" | "gated";
}

export interface FileRecord {
  name: string;
  type: string;
  size: number;
  blocked: boolean;
  flagged: boolean;
  alertes: string[];
  content?: string;
  success: boolean;
  extraction?: AssetExtraction;
}

export interface AssetBloc {
  label: string;
  status: string;
  valeur: string | null;
}

export interface AssetExtraction {
  identifiant: string;
  source: string;
  content_length: number;
  blocs: Record<string, AssetBloc>;
  score: number;
  decision: number;
  decision_txt: string;
  questions: string[];
  alertes: string[];
}

export interface EnrichissementData {
  motivation: string;
  anciennete: string;
  prix_min: string;
  travaux: string;
  histoire: string;
  source: string;
}

export interface AIFData {
  identifiant: string;
  nom_actif: string;
  prix: number;
  typologie: string;
  ville: string;
  surface_habitable: number;
  nb_pieces: number;
  nb_chambres: number;
  nb_sdb: number;
  dpe_classe: string | null;
  score_completude: number;
  decision: number;
  fit_fonctionnel: string;
  fit_emotionnel: string;
  intentions: Record<string, { statut: string; niveau: string }>;
  niveau_confiance: string;
  version: string;
  created_at: string;
  photos: string[];
}

export interface AIFResult {
  aif: AIFData;
  vignette: string;
  note_actif: string;
  asset_briefing: string;
}

export const api = {
  projects: {
    list: (includeTrashed = false) => request<Project[]>(`/projects/?include_trashed=${includeTrashed}`),
    create: (name: string) => request<{ id: string; name: string }>("/projects/", { method: "POST", body: JSON.stringify({ name }) }),
    get: (id: string) => request<Project & { files: FileRecord[]; assets: any[] }>(`/projects/${id}`),
    trash: (id: string) => request<{ ok: boolean; trashed: boolean }>(`/projects/${id}/trash`, { method: "POST" }),
    restore: (id: string) => request<{ ok: boolean; trashed: boolean }>(`/projects/${id}/restore`, { method: "POST" }),
    rename: (id: string, name: string) => request<{ ok: boolean; name: string }>(`/projects/${id}/rename`, { method: "POST", body: JSON.stringify({ name }) }),
    setVisibility: (id: string, visibility: "private" | "public" | "gated") =>
      request<{ ok: boolean; visibility: string }>(`/projects/${id}/visibility`, { method: "POST", body: JSON.stringify({ visibility }) }),
    delete: (id: string) => request<{ ok: boolean }>(`/projects/${id}`, { method: "DELETE" }),
  },
  upload: (projectId: string, file: File) => {
    const fd = new FormData();
    fd.append("project_id", projectId);
    fd.append("file", file);
    return fetch(`${BASE}/upload/`, { method: "POST", body: fd }).then((r) => r.json()) as Promise<{ success: boolean; file: FileRecord }>;
  },
  pipeline: {
    controlR1: (projectId: string, filename: string) =>
      request<{ success: boolean; data: AssetExtraction }>("/pipeline/control-r1", { method: "POST", body: JSON.stringify({ project_id: projectId, filename }) }),
    enrichissement: (projectId: string, data: EnrichissementData) =>
      request<{ success: boolean; data: any }>("/pipeline/enrichissement", { method: "POST", body: JSON.stringify({ project_id: projectId, data }) }),
    aif: (projectId: string, data: AIFData) =>
      request<{ success: boolean; data: AIFResult }>("/pipeline/aif", { method: "POST", body: JSON.stringify({ project_id: projectId, data }) }),
  },
  health: () => request<{ status: string }>("/health"),
};
