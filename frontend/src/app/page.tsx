"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Plus, Trash2, ChevronRight, Upload, FileText, CheckCircle2, AlertTriangle,
  XCircle, Download, RefreshCw, Loader2, Sparkles, Shield, ArrowRight,
  Search, MessageSquare, FileSpreadsheet, FolderOpen, Menu, X,
  RotateCcw, Globe, Lock,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { api, Project, FileRecord, AssetExtraction, EnrichissementData, AIFData, AIFResult } from "@/lib/api";

type Stage = "home" | "depot" | "controle" | "enrichissement" | "passeport";

const STAGES: { key: Stage; label: string; icon: React.ReactNode }[] = [
  { key: "depot", label: "Dépôt", icon: <Upload size={14} /> },
  { key: "controle", label: "Contrôle R1", icon: <Search size={14} /> },
  { key: "enrichissement", label: "Enrichissement", icon: <MessageSquare size={14} /> },
  { key: "passeport", label: "AIF & Passeport", icon: <FileSpreadsheet size={14} /> },
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [trashedProjects, setTrashedProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [project, setProject] = useState<any>(null);
  const [stage, setStage] = useState<Stage>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [visFilter, setVisFilter] = useState<"all" | "public" | "gated">("all");

  const [files, setFiles] = useState<FileRecord[]>([]);
  const [extraction, setExtraction] = useState<AssetExtraction | null>(null);
  const [enrichData, setEnrichData] = useState<any>(null);
  const [enrichResult, setEnrichResult] = useState<any>(null);
  const [aifResult, setAifResult] = useState<AIFResult | null>(null);
  const [aifForm, setAifForm] = useState({
    nom_actif: "", typologie: "Appartement", ville: "",
    prix: 0, surface_habitable: 0, nb_pieces: 0, nb_chambres: 0, nb_sdb: 0,
    dpe_classe: "Non renseigné",
  });
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [bulkDrag, setBulkDrag] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const startRename = (p: Project) => {
    setRenaming(p.id);
    setRenameValue(p.name);
  };

  const commitRename = async () => {
    if (!renaming || !renameValue.trim()) { setRenaming(null); return; }
    try {
      await api.projects.rename(renaming, renameValue.trim());
      addLog(`Projet renomme: ${renameValue.trim()}`);
      setRenaming(null);
      fetchProjects();
    } catch { addLog("Erreur rename"); }
  };

  const bulkImport = async (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setBulkDrag(false);
    const flist = "dataTransfer" in e ? e.dataTransfer.files : e.target.files;
    if (!flist?.length) return;
    setLoading(true);
    const files = Array.from(flist);
    addLog(`Import multiple: ${files.length} fichier(s)`);
    for (const file of files) {
      try {
        const name = file.name.replace(/\.[^.]+$/, "");
        const p = await api.projects.create(name);
        const res = await api.upload(p.id, file);
        addLog(`${file.name} → projet ${p.id} ${res.file.blocked ? "🚫" : "✓"}`);
      } catch { addLog(`Erreur import: ${file.name}`); }
    }
    setLoading(false);
    fetchProjects();
  };

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev.slice(-50), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  useEffect(() => { fetchProjects(); }, []);
  useEffect(() => {
    if (selected) {
      api.projects.get(selected).then((p) => {
        setProject(p);
        const loadedFiles = p.files || [];
        setFiles(loadedFiles);
        const cached = loadedFiles.find((f: any) => f.extraction) as any;
        if (cached?.extraction) {
          setExtraction(cached.extraction as AssetExtraction);
          addLog(`Analyse restaurée (score: ${cached.extraction.score}%)`);
          fillAifFromExtraction(cached.extraction as AssetExtraction);
        } else {
          setExtraction(null);
        }
        if ((p as any).enrichissement) {
          setEnrichResult((p as any).enrichissement);
          addLog("Enrichissement restaure");
        }
        // Restaurer le dernier AIF depuis le cache
        const assets = (p as any).assets || [];
        const lastAif = assets.filter((a: any) => a.aif).pop();
        if (lastAif) {
          setAifResult(lastAif as any);
          setAifForm((prev) => ({
            ...prev,
            ...lastAif.aif,
          }));
          addLog(`AIF restauré (note: ${lastAif.aif?.qualite?.note || "?"}/5)`);
        } else {
          setAifResult(null);
        }
        setStage(p.stage >= 4 ? "passeport" : p.stage >= 3 ? "enrichissement" : p.stage >= 2 ? "controle" : "depot");
      });
    }
  }, [selected]);

  const fetchProjects = async () => {
    try {
      const [list, trash] = await Promise.all([
        api.projects.list(false),
        api.projects.list(true),
      ]);
      setProjects(list);
      setTrashedProjects(trash.filter((p) => p.trashed));
    } catch { addLog("⚠ Backend non connecté"); }
  };

  const fillAifFromExtraction = (ext?: AssetExtraction | null) => {
    const src = ext || extraction;
    if (!src) return;
    const b = src.blocs;
    setAifForm((prev) => ({
      nom_actif: prev.nom_actif || [b.ville?.valeur, b.typologie?.valeur].filter(Boolean).join(" - ") || "",
      typologie: b.typologie?.valeur || prev.typologie,
      ville: b.ville?.valeur?.split(",")[0]?.split("(")[0]?.trim() || prev.ville,
      prix: parseFloat(b.prix?.valeur?.replace(/[^\d]/g, "") || "0") || prev.prix,
      surface_habitable: parseFloat(b.surface_habitable?.valeur?.replace(/[^\d.]/g, "") || "0") || prev.surface_habitable,
      nb_pieces: parseInt(b.nb_pieces?.valeur?.replace(/[^\d]/g, "") || "0") || prev.nb_pieces,
      nb_chambres: parseInt(b.nb_chambres?.valeur?.replace(/[^\d]/g, "") || "0") || prev.nb_chambres,
      nb_sdb: parseInt(b.nb_sdb?.valeur?.replace(/[^\d]/g, "") || "0") || prev.nb_sdb,
      dpe_classe: b.dpe_classe?.valeur || prev.dpe_classe,
    }));
  };

  const newProject = async () => {
    const p = await api.projects.create("Nouveau projet");
    setSelected(p.id);
    setProject({ ...p, files: [], assets: [], stage: 0 });
    setFiles([]);
    setExtraction(null);
    setEnrichResult(null);
    setAifResult(null);
    setStage("depot");
    addLog(`Projet ${p.id} créé`);
    fetchProjects();
  };

  const trashProject = async (id: string) => {
    try {
      await api.projects.trash(id);
      addLog(`Projet ${id} → corbeille`);
      if (selected === id) {
        setSelected(null);
        setProject(null);
        setFiles([]);
        setExtraction(null);
        setEnrichResult(null);
        setAifResult(null);
        setStage("home");
      }
      fetchProjects();
    } catch { addLog("Erreur mise en corbeille"); }
  };

  const cycleVisibility = async (p: Project) => {
    const next = p.visibility === "gated" ? "public" : p.visibility === "public" ? "private" : "gated";
    try {
      await api.projects.setVisibility(p.id, next);
      addLog(`Visibilité ${p.id} → ${next}`);
      fetchProjects();
    } catch { addLog("Erreur changement de visibilité"); }
  };

  const setPassportVisibility = async (visibility: "private" | "public" | "gated") => {
    if (!selected) return;
    try {
      await api.projects.setVisibility(selected, visibility);
      addLog(`Visibilité ${selected} → ${visibility}`);
      const p = await api.projects.get(selected);
      setProject(p);
      fetchProjects();
    } catch { addLog("Erreur changement de visibilité"); }
  };

  const restoreProject = async (id: string) => {
    try {
      await api.projects.restore(id);
      addLog(`Projet ${id} restauré`);
      fetchProjects();
    } catch { addLog("Erreur restauration"); }
  };

  const deletePermanently = async (id: string) => {
    if (!confirm(`Supprimer définitivement le projet ${id} ? Irréversible.`)) return;
    try {
      await api.projects.delete(id);
      addLog(`Projet ${id} supprimé définitivement`);
      fetchProjects();
    } catch { addLog("Erreur suppression définitive"); }
  };

  const processFiles = async (flist: FileList | File[]) => {
    if (!selected) return;
    setLoading(true);
    const uploaded: FileRecord[] = [];
    for (const file of Array.from(flist)) {
      try {
        const res = await api.upload(selected, file);
        addLog(`${file.name} ${res.file.blocked ? "🚫 BLOQUÉ" : "✓ OK"} (id=${selected.slice(0,6)})`);
        if (res.file.alertes?.length) {
          res.file.alertes.forEach((a: string) => addLog(`  ⚠ ${a}`));
        }
        uploaded.push(res.file);
      } catch (err) {
        addLog(`Erreur upload: ${file.name}`);
      }
    }
    const p = await api.projects.get(selected);
    setProject(p);
    const merged = uploaded.length > 0 ? uploaded : (p.files || []);
    setFiles(merged);
    addLog(`${merged.length} fichier(s) chargé(s)`);
    if (uploaded.length > 0) setStage("controle");
    setLoading(false);
    fetchProjects();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  };

  const runControlR1 = async (filename: string) => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await api.pipeline.controlR1(selected, filename);
      if (res.success) {
        setExtraction(res.data);
        addLog(`Contrôle R1 — Score: ${res.data.score}% — ${res.data.decision_txt} (via ${(res as any)._meta?.provider || "?"})`);
        const blocs = res.data.blocs;
        const typologie = blocs.typologie?.valeur;
        const ville = blocs.ville?.valeur;
        const prix = blocs.prix?.valeur;
        const mandataire = blocs.mandataire?.valeur;
        if (typologie && ville && prix) {
          const parts = [typologie, ville, `${prix}€`];
          if (mandataire) parts.push(mandataire);
          const newName = parts.join(" - ");
          try {
            await api.projects.rename(selected, newName);
            setProject((prev: any) => prev ? { ...prev, name: newName } : prev);
            addLog(`Projet renommé automatiquement → "${newName}"`);
            fetchProjects();
          } catch { /* rename silencieux */ }
        }
      } else {
        addLog(`Contrôle R1 échoué: ${(res as any).error || (res as any).detail || "inconnu"}`);
      }
    } catch { addLog("Erreur contrôle R1"); }
    setLoading(false);
  };

  const [enrichNotes, setEnrichNotes] = useState("");
  const [enrichAttachments, setEnrichAttachments] = useState<{ name: string; size: number }[]>([]);
  const enrichFileRef = useRef<HTMLInputElement>(null);

  const handleEnrichUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selected || !e.target.files?.length) return;
    for (const file of Array.from(e.target.files)) {
      try {
        const res = await api.uploadEnrichissement(selected, file);
        if (res.success) {
          setEnrichAttachments((prev) => [...prev, res.file]);
          addLog(`Document ajouté: ${res.file.name}`);
        }
      } catch { addLog(`Erreur upload ${file.name}`); }
    }
    e.target.value = "";
  };

  const runEnrichissement = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const data: EnrichissementData = {
        notes: enrichNotes,
        source: "declaration orale mandataire",
      };
      const res = await api.pipeline.enrichissement(selected, data);
      if (res.success) {
        setEnrichData(data);
        setEnrichResult(res.data);
        fillAifFromExtraction();
        setStage("passeport");
        addLog("Enrichissement terminé");
      }
    } catch { addLog("Erreur enrichissement"); }
    setLoading(false);
  };

  const runAIF = async () => {
    if (!selected || !extraction) return;
    setLoading(true);
    try {
      const data: AIFData = {
        identifiant: extraction.identifiant,
        ...aifForm,
        score_completude: extraction.score,
        decision: extraction.decision,
        fit_fonctionnel: enrichResult?.fit_fonctionnel || "À documenter",
        fit_emotionnel: enrichResult?.fit_emotionnel || "À documenter",
        intentions: enrichResult?.intentions || {},
        qualite: { note: 0, criteres: [] },
        version: "1.0",
        created_at: new Date().toISOString(),
      };
      const res = await api.pipeline.aif(selected, data);
      if (res.success) {
        setAifResult(res.data);
        const q = res.data.aif.qualite;
        addLog(`AIF généré — ${aifForm.nom_actif || "Actif UPRE"} — Note: ${q?.note?.toFixed(1) || "?"}/5`);
      }
    } catch { addLog("Erreur génération AIF"); }
    setLoading(false);
    fetchProjects();
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0"} border-r border-[var(--border)] bg-[var(--surface)] flex flex-col transition-all duration-200 overflow-hidden shrink-0`}>
        <div className="p-4 flex items-center justify-between">
          <a
            href={process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}
            className="font-bold text-sm tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
            title="Retour au site"
          >
            ◇ UPRE
          </a>
          <ThemeToggle />
        </div>
        <div className="px-3 pb-2">
          <button onClick={newProject} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Nouveau projet
          </button>
        </div>
        <div className="px-3 text-xs font-semibold uppercase opacity-40 tracking-wider mt-2 mb-1">Projets</div>
        <div className="px-3 pb-2 flex gap-1">
          {([
            { key: "all", label: "Tous" },
            { key: "public", label: "Visible" },
            { key: "gated", label: "Off-Market" },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setVisFilter(f.key)}
              className={`px-2 py-1 text-[11px] rounded-md font-medium transition-colors ${
                visFilter === f.key
                  ? "bg-[var(--accent)] text-white"
                  : "opacity-50 hover:opacity-80 hover:bg-[var(--background)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto px-2" style={{ flex: "1 1 auto" }}>
          {projects.filter((p) => visFilter === "all" || p.visibility === visFilter).map((p) => (
            <div key={p.id} className={`mb-0.5 rounded-lg group ${selected === p.id ? "bg-[var(--accent)]/10 ring-1 ring-[var(--accent)]/20" : "hover:bg-[var(--background)]"}`}>
              {renaming === p.id ? (
                <div className="flex items-center gap-2 px-3 py-2">
                  <FolderOpen size={14} className="opacity-50 shrink-0" />
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenaming(null); }}
                    className="flex-1 text-sm bg-transparent border-b border-[var(--accent)] outline-none min-w-0"
                  />
                </div>
              ) : (
                <button
                  onClick={() => { setSelected(p.id); setExtraction(null); setEnrichResult(null); setAifResult(null); }}
                  className="w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2"
                >
                  <FolderOpen size={14} className="opacity-50 shrink-0" />
                  <span className="truncate flex-1">{p.name}</span>
                  {p.last_score != null ? (
                    <span className={`text-[10px] font-semibold tabular-nums shrink-0 ${p.last_score >= 70 ? "text-[var(--badge-ok)]" : p.last_score >= 40 ? "text-amber-500" : "text-[var(--badge-err)]"}`}>{p.last_score}%</span>
                  ) : p.stage >= 2 ? (
                    <span className="text-[10px] opacity-30 tabular-nums shrink-0">--</span>
                  ) : null}
                  <span
                    onClick={(e) => { e.stopPropagation(); cycleVisibility(p); }}
                    className={`shrink-0 p-0.5 rounded transition-opacity ${
                      p.visibility === "public" ? "text-[var(--badge-ok)]" : p.visibility === "gated" ? "text-amber-500" : "opacity-30"
                    }`}
                    title={
                      p.visibility === "public"
                        ? "Visible sur le site — cliquer pour passer en Off-Market"
                        : p.visibility === "gated"
                        ? "Off-Market (accès protégé) — cliquer pour rendre privé"
                        : "Privé (non publié) — cliquer pour rendre visible"
                    }
                  >
                    {p.visibility === "public" ? <Globe size={12} /> : <Lock size={12} />}
                  </span>
                  <span
                    onClick={(e) => { e.stopPropagation(); startRename(p); }}
                    className="shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity"
                    title="Renommer"
                  >
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" className="opacity-60"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/></svg>
                  </span>
                  <span
                    onClick={(e) => { e.stopPropagation(); trashProject(p.id); }}
                    className="shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-40 hover:opacity-100 hover:text-amber-500 transition-opacity"
                    title="Mettre a la corbeille"
                  >
                    <Trash2 size={12} />
                  </span>
                </button>
              )}
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-xs text-center opacity-40 py-8">Aucun projet</p>
          )}
        </div>

        {/* ── Corbeille ── */}
        {trashedProjects.length > 0 && (
          <div className="border-t border-[var(--border)]">
            <div className="px-3 text-xs font-semibold uppercase opacity-40 tracking-wider mt-2 mb-1 flex items-center gap-1.5">
              <Trash2 size={11} /> Corbeille ({trashedProjects.length})
            </div>
            <div className="overflow-y-auto max-h-36 px-2 mb-2">
              {trashedProjects.map((p) => (
                <div
                  key={p.id}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs mb-0.5 flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity group"
                >
                  <FolderOpen size={12} className="shrink-0" />
                  <span className="truncate">{p.name}</span>
                  <span className="ml-auto flex items-center gap-0.5 shrink-0">
                    <span
                      onClick={(e) => { e.stopPropagation(); restoreProject(p.id); }}
                      className="p-0.5 rounded opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-green-500 transition-opacity"
                      title="Restaurer"
                    >
                      <RotateCcw size={12} />
                    </span>
                    <span
                      onClick={(e) => { e.stopPropagation(); deletePermanently(p.id); }}
                      className="p-0.5 rounded opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-red-500 transition-opacity"
                      title="Supprimer définitivement"
                    >
                      <X size={13} />
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-[var(--border)] p-3 text-xs opacity-40 space-y-1 max-h-32 overflow-y-auto">
          {logs.slice(-8).map((l, i) => <div key={i} className="truncate">{l}</div>)}
        </div>
      </aside>

      {/* ── Mobile sidebar toggle ── */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute top-3 left-3 z-50 p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] lg:hidden">
        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        {!selected ? (
          /* ── Home / No project ── */
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="mb-6 opacity-20 text-6xl">◇</div>
            <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)]">UPRE Asset Intelligence</h1>
            <p className="text-[var(--muted)] max-w-md mb-8">
              Transformez vos fiches commerciales en actifs qualifiés, protégés et activables.
            </p>
            <button onClick={newProject} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-opacity">
              <Sparkles size={18} /> Démarrer un projet
            </button>

            <div className="mt-6 w-full max-w-sm">
              <div
                className={`p-4 rounded-xl border border-dashed text-center transition-all cursor-pointer ${bulkDrag ? "border-blue-400 bg-blue-500/5 scale-[1.02]" : "border-[var(--border)]/50 hover:border-[var(--accent)]/30"}`}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => { e.preventDefault(); setBulkDrag(true); }}
                onDragLeave={(e) => { e.preventDefault(); setBulkDrag(false); }}
                onDrop={bulkImport}
              >
                <Upload className="mx-auto mb-1 opacity-25" size={20} />
                <p className="text-xs font-medium">Import multiple</p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5">Glissez plusieurs fiches R1 — 1 projet créé par fichier</p>
                <label className="inline-block mt-2 text-[10px] text-[var(--accent)] hover:underline cursor-pointer">
                  ou parcourir...
                  <input type="file" multiple accept=".pdf,.docx,.doc,.txt" onChange={bulkImport} className="hidden" />
                </label>
              </div>
            </div>
            <div className="mt-12 flex gap-3 text-xs text-[var(--muted)]">
              {STAGES.map((s, i) => (
                <span key={s.key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)]">
                  {s.icon} {s.label}
                  {i < STAGES.length - 1 && <ArrowRight size={10} className="ml-1 opacity-40" />}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* ── Project View ── */
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-[var(--foreground)]">{project?.name || "Projet"}</h1>
                <p className="text-xs text-[var(--muted)]">
                  {files.length} fichier(s) · Étape {project?.stage || 0}/4
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setSelected(null); setProject(null); }} className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <RefreshCw size={13} /> Changer de projet
                </button>
              </div>
            </div>

            {/* ── Pipeline Progress ── */}
            <div className="flex gap-1 mb-8">
              {STAGES.map((s, i) => {
                const currentIdx = STAGES.findIndex((x) => x.key === stage);
                const done = i < currentIdx;
                const active = i === currentIdx;
                return (
                  <button key={s.key} onClick={() => setStage(s.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${done ? "bg-[var(--badge-ok)]/10 text-[var(--badge-ok)] hover:bg-[var(--badge-ok)]/20" : active ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-transparent text-[var(--muted)] border border-[var(--border)] hover:bg-[var(--surface)]"}`}
                  >
                    {done ? <CheckCircle2 size={14} /> : s.icon}
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── Stage 1: Depot ── */}
            {stage === "depot" && (
              <div className="animate-in space-y-6">
                <div
                  className={`p-6 rounded-xl border border-dashed text-center transition-all ${dragOver ? "border-blue-400 bg-blue-500/5 scale-[1.02]" : "border-[var(--border)] bg-[var(--surface)]/50"}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto mb-2 opacity-30" size={32} />
                  <p className="text-sm font-medium mb-1">Déposer vos fiches R1</p>
                  <p className="text-xs text-[var(--muted)] mb-4">PDF, DOCX, TXT — Glissez-déposez ou cliquez</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity">
                    <Plus size={14} /> Choisir des fichiers
                    <input type="file" multiple accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png" onChange={handleUpload} className="hidden" />
                  </label>
                  {loading && <Loader2 className="animate-spin mx-auto mt-4" size={20} />}
                </div>

                {files.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase tracking-wider opacity-40">Fichiers deposes ({files.length})</h3>
                      {files.some((f) => !f.blocked && !(f as any).extraction) && (
                        <button onClick={() => {
                          files.filter((f) => !f.blocked && !(f as any).extraction).forEach((f) => runControlR1(f.name));
                          setStage("controle");
                        }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity">
                          <Sparkles size={12} /> Tout analyser
                        </button>
                      )}
                    </div>
                    {files.map((f, i) => (
                      <div key={i} className={`flex flex-col gap-1.5 px-4 py-2.5 rounded-lg border ${f.blocked ? "border-red-500/30 bg-red-500/5" : f.flagged ? "border-amber-500/30 bg-amber-500/5" : "border-[var(--border)] bg-[var(--surface)]"}`}>
                        <div className="flex items-center gap-3">
                          {f.blocked ? <XCircle size={16} className="text-[var(--badge-err)] shrink-0" /> : f.flagged ? <AlertTriangle size={16} className="text-amber-500 shrink-0" /> : <FileText size={16} className="opacity-40 shrink-0" />}
                          <span className="flex-1 text-sm truncate">{f.name}</span>
                          <span className="text-xs opacity-40">{(f.size / 1024).toFixed(1)} KB</span>
                          {!f.blocked && (
                            (f as any).extraction ? (
                              <div className="flex gap-1.5 shrink-0">
                                <button onClick={() => { runControlR1(f.name); setStage("controle"); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors">
                                  <RefreshCw size={12} /> Ré-analyser
                                </button>
                                <button onClick={() => { setExtraction((f as any).extraction); setStage("controle"); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[var(--badge-ok)]/30 text-[var(--badge-ok)] hover:bg-[var(--badge-ok)]/10 transition-colors">
                                  <CheckCircle2 size={12} /> Voir resultat
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => { runControlR1(f.name); setStage("controle"); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors shrink-0">
                                <Search size={12} /> Analyser
                              </button>
                            )
                          )}
                        </div>
                        {f.flagged && !f.blocked && (
                          <div className="flex items-start gap-2 pl-6 text-xs">
                            <AlertTriangle size={12} className="text-amber-500 mt-0.5 shrink-0" />
                            <div className="text-amber-600/80 dark:text-amber-400/80">
                              <span className="font-medium">Fichier surveille — contenu sensible</span>
                              <ul className="list-disc list-inside mt-0.5 opacity-70">
                                {(f.alertes || []).map((a: string, j: number) => (
                                  <li key={j}>{a.replace(/_/g, " ").toLowerCase()}</li>
                                ))}
                              </ul>
                              <p className="mt-0.5 opacity-50 text-[10px]">Le fichier peut etre analyse mais contient des termes sous surveillance.</p>
                            </div>
                          </div>
                        )}
                        {f.blocked && (
                          <div className="flex items-start gap-2 pl-6 text-xs">
                            <Shield size={12} className="text-[var(--badge-err)] mt-0.5 shrink-0" />
                            <div className="text-[var(--badge-err)]/80">
                              <span className="font-medium">Fichier bloque — securite UPRE</span>
                              <ul className="list-disc list-inside mt-0.5 opacity-70">
                                {(f.alertes || []).map((a: string, j: number) => (
                                  <li key={j}>{a.replace(/_/g, " ").toLowerCase()}</li>
                                ))}
                                {(f.alertes || []).length === 0 && <li>injection detectee</li>}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Stage 2: Controle R1 ── */}
            {stage === "controle" && (
              <div className="animate-in space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Contrôle R1</h2>
                  <button onClick={() => setStage("depot")} className="text-xs text-[var(--muted)] hover:underline">← Retour au dépôt</button>
                </div>

                {files.filter((f) => !f.blocked).length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <Shield size={28} className="mx-auto opacity-20" />
                    <p className="text-sm text-[var(--muted)]">Aucun fichier exploitable</p>
                    <p className="text-xs text-[var(--muted)]/50">{files.length} fichier(s) dans le projet</p>
                    {files.filter(f => f.blocked).length > 0 && (
                      <div className="mt-3 p-3 rounded-lg border border-red-500/20 bg-red-500/[0.03] max-w-sm mx-auto text-left">
                        <p className="text-xs font-medium text-[var(--badge-err)] mb-1.5 flex items-center gap-1.5">
                          <Shield size={12} /> {files.filter(f => f.blocked).length} fichier(s) bloque(s) par securite
                        </p>
                        {files.filter(f => f.blocked).map((f: any, i: number) => (
                          <div key={i} className="text-[11px] text-[var(--badge-err)]/70 ml-5">
                            <span className="font-medium">{f.name}</span>
                            {(f.alertes || []).map((a: string, j: number) => (
                              <span key={j} className="block opacity-60">• {a.replace(/_/g, " ").toLowerCase()}</span>
                            ))}
                          </div>
                        ))}
                        <p className="text-[10px] text-[var(--muted)] mt-2 opacity-50">Ce n'est pas un bug — le sanitizer UPRE a detecte une tentative d'injection ou un contenu sensible et a bloque le fichier pour proteger le pipeline.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {files.filter((f) => !f.blocked).map((f, i) => {
                      const cached = (f as any).extraction;
                      return (
                        <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                          <FileText size={16} className="opacity-40 shrink-0" />
                          <span className="flex-1 text-sm truncate">{f.name}</span>
                          {cached ? (
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => runControlR1(f.name)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors">
                                <RefreshCw size={12} /> Ré-analyser
                              </button>
                              <button onClick={() => setExtraction(cached)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[var(--badge-ok)]/30 text-[var(--badge-ok)] hover:bg-[var(--badge-ok)]/10 transition-colors">
                                <CheckCircle2 size={12} /> Voir resultat
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => runControlR1(f.name)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors shrink-0">
                              <Search size={12} /> Analyser
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {extraction && (
                  <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Résultat — {extraction.source}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${extraction.decision === 1 ? "bg-green-500/10 text-green-600 dark:text-green-400" : extraction.decision === 2 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                        {extraction.decision_txt}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">{extraction.score}% <span className="text-xs font-normal text-[var(--muted)]">complétude</span></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {Object.entries(extraction.blocs).map(([key, b]) => (
                        <div key={key} className="flex items-center gap-1.5 text-xs">
                          {b.status === "present" ? <CheckCircle2 size={12} className="text-[var(--badge-ok)]" /> : <XCircle size={12} className="opacity-25" />}
                          <span className="opacity-60">{b.label}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setStage("enrichissement")} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90">
                      Continuer <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Stage 3: Enrichissement ── */}
            {stage === "enrichissement" && (
              <div className="animate-in space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Enrichissement — Dialogue mandataire</h2>
                  <button onClick={() => setStage("controle")} className="text-xs text-[var(--muted)] hover:underline">← Retour au controle R1</button>
                </div>
                <p className="text-sm text-[var(--muted)]">Complétez les réponses obtenues du mandataire pour qualifier le Fit Fonctionnel et Emotionnel.</p>

                {extraction ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Notes du mandataire</label>
                      <textarea value={enrichNotes} onChange={(e) => setEnrichNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                        placeholder="Le mandataire peut tout écrire ici : contexte, historique, particularités, prix, travaux, motivations..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Documents complémentaires (photos, plans, diagnostics...)</label>
                      <div className="flex items-center gap-2">
                        <button onClick={() => enrichFileRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--accent)]/40 text-[var(--accent)] text-sm hover:bg-[var(--accent)]/10 transition-colors">
                          <Upload size={14} /> Ajouter des fichiers
                        </button>
                        <input ref={enrichFileRef} type="file" multiple accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png" onChange={handleEnrichUpload} className="hidden" />
                      </div>
                      {enrichAttachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {enrichAttachments.map((a, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs opacity-60">
                              <FileText size={12} /> {a.name} <span className="opacity-40">({(a.size / 1024).toFixed(1)} KB)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted)] italic">Aucune extraction disponible. Analysez d'abord un document dans le Controle R1.</p>
                )}

                <button onClick={runEnrichissement} disabled={loading || !extraction} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 disabled:opacity-50">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                  Enrichir & qualifier l'actif
                </button>

                {enrichResult && (
                  <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
                    <h3 className="font-semibold">Résultat enrichissement</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[var(--background)]">
                        <h4 className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-1">Fit Fonctionnel</h4>
                        <p className="text-sm opacity-70">{enrichResult.fit_fonctionnel}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[var(--background)]">
                        <h4 className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-1">Fit Émotionnel</h4>
                        <p className="text-sm opacity-70">{enrichResult.fit_emotionnel}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-2">Intentions UPRE</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(enrichResult.intentions || {}).map(([k, v]: [string, any]) => (
                          <span key={k} className="px-2.5 py-1 text-xs rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-medium">
                            {k} · {v.statut}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Stage 4: AIF & Passeport ── */}
            {stage === "passeport" && (
              <div className="animate-in space-y-6">
                <h2 className="text-lg font-bold">AIF — Asset Intelligence File</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold opacity-50 uppercase tracking-wider">Nom d'actif</label>
                    <input type="text" value={aifForm.nom_actif} onChange={(e) => setAifForm({ ...aifForm, nom_actif: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm" placeholder="Ex: L'Hôtel Particulier" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold opacity-50 uppercase tracking-wider">Typologie</label>
                    <select value={aifForm.typologie} onChange={(e) => setAifForm({ ...aifForm, typologie: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm">
                      {["Appartement", "Maison", "Loft", "Villa", "Hôtel particulier", "Immeuble", "Duplex", "Triplex", "Studio", "Propriété", "Domaine"].map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold opacity-50 uppercase tracking-wider">Ville</label>
                    <input type="text" value={aifForm.ville} onChange={(e) => setAifForm({ ...aifForm, ville: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm" placeholder="Ex: Paris 16ᵉ" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold opacity-50 uppercase tracking-wider">Prix (EUR)</label>
                    <input type="number" value={aifForm.prix || ""} onChange={(e) => setAifForm({ ...aifForm, prix: +e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold opacity-50 uppercase tracking-wider">Surface (m²)</label>
                    <input type="number" value={aifForm.surface_habitable || ""} onChange={(e) => setAifForm({ ...aifForm, surface_habitable: +e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold opacity-50 uppercase tracking-wider">DPE</label>
                    <select value={aifForm.dpe_classe} onChange={(e) => setAifForm({ ...aifForm, dpe_classe: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm">
                      {["Non renseigné", "A", "B", "C", "D", "E", "F", "G"].map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold opacity-50 uppercase tracking-wider">Pièces</label>
                    <input type="number" value={aifForm.nb_pieces || ""} onChange={(e) => setAifForm({ ...aifForm, nb_pieces: +e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold opacity-50 uppercase tracking-wider">Chambres</label>
                    <input type="number" value={aifForm.nb_chambres || ""} onChange={(e) => setAifForm({ ...aifForm, nb_chambres: +e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold opacity-50 uppercase tracking-wider">Salles de bain</label>
                    <input type="number" value={aifForm.nb_sdb || ""} onChange={(e) => setAifForm({ ...aifForm, nb_sdb: +e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={runAIF} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 disabled:opacity-50">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {aifResult ? "Regenerer l'AIF" : "Generer l'AIF"}
                  </button>
                </div>

                {aifResult && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-sm font-bold ${(aifResult.aif.qualite?.note ?? 0) >= 4 ? "text-green-600 dark:text-green-400" : (aifResult.aif.qualite?.note ?? 0) >= 2.5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                        {aifResult.aif.qualite?.note?.toFixed(1) || "?"} / 5
                      </span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((s) => (
                          <div key={s} className={`w-2.5 h-2.5 rounded-full ${s <= Math.round(aifResult.aif.qualite?.note ?? 0) ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
                        ))}
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-medium">
                        v{aifResult.aif.version}
                      </span>
                      <Shield size={14} className="text-[var(--muted)]" />
                    </div>

                    {/* Critères qualitatifs */}
                    {aifResult.aif.qualite?.criteres?.length > 0 && (
                      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                        <h3 className="text-xs font-semibold uppercase tracking-wider opacity-40 mb-3">Critères de qualité</h3>
                        <div className="space-y-2">
                          {aifResult.aif.qualite.criteres.map((c, i) => (
                            <div key={i}>
                              <div className="flex items-center justify-between text-sm mb-0.5">
                                <span className="font-medium">{c.label}</span>
                                <span className={`font-bold ${c.score >= 4 ? "text-green-600 dark:text-green-400" : c.score >= 2.5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>{c.score}/5</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                                <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${(c.score / 5) * 100}%` }} />
                              </div>
                              {c.commentaire && <p className="text-xs opacity-50 mt-0.5">{c.commentaire}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Publication sur le site */}
                    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                      <h3 className="text-sm font-semibold mb-1">Publication sur le site</h3>
                      <p className="text-xs opacity-50 mb-3">Choisir où ce bien apparaît sur la vitrine publique.</p>
                      <div className="flex gap-2">
                        {([
                          { key: "private", label: "Privé", desc: "Non publié" },
                          { key: "public", label: "Visible", desc: "Vignette + fiche publiques" },
                          { key: "gated", label: "Off-Market", desc: "Accès protégé (Gated)" },
                        ] as const).map((v) => {
                          const current = project?.assets?.[project.assets.length - 1]?.aif?.visibility ?? "private";
                          const active = current === v.key;
                          return (
                            <button
                              key={v.key}
                              onClick={() => setPassportVisibility(v.key)}
                              title={v.desc}
                              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                                active
                                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                                  : "border-[var(--border)] hover:bg-[var(--background)] opacity-70"
                              }`}
                            >
                              {v.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Vignette */}
                    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold">📋 Vignette <span className="text-xs font-normal opacity-40">(Public)</span></h3>
                        <button onClick={() => downloadText(aifResult.vignette, `vignette_${aifForm.nom_actif || "actif"}.txt`)} className="text-xs flex items-center gap-1 text-[var(--accent)] hover:underline">
                          <Download size={12} /> Télécharger
                        </button>
                      </div>
                      <pre className="text-xs opacity-70 whitespace-pre-wrap font-mono">{aifResult.vignette}</pre>
                    </div>

                    {/* Note d'Actif */}
                    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold">📄 Note d'Actif <span className="text-xs font-normal opacity-40">(Qualifié)</span></h3>
                        <button onClick={() => downloadText(aifResult.note_actif, `note_${aifForm.nom_actif || "actif"}.txt`)} className="text-xs flex items-center gap-1 text-[var(--accent)] hover:underline">
                          <Download size={12} /> Télécharger
                        </button>
                      </div>
                      <pre className="text-xs opacity-70 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">{aifResult.note_actif}</pre>
                    </div>

                    {/* Annonce mandataire */}
                    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold">📰 Annonce <span className="text-xs font-normal opacity-40">(version mandataire)</span></h3>
                        <button onClick={() => downloadText(aifResult.annonce_mandataire, `annonce_${aifForm.nom_actif || "actif"}.txt`)} className="text-xs flex items-center gap-1 text-[var(--accent)] hover:underline">
                          <Download size={12} /> Télécharger
                        </button>
                      </div>
                      <p className="text-sm opacity-70 whitespace-pre-wrap">{aifResult.annonce_mandataire}</p>
                    </div>

                    {/* Parole client */}
                    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold">💬 Parole du propriétaire <span className="text-xs font-normal opacity-40">(comme si le client parlait de son bien)</span></h3>
                        <button onClick={() => downloadText(aifResult.parole_client, `parole_${aifForm.nom_actif || "actif"}.txt`)} className="text-xs flex items-center gap-1 text-[var(--accent)] hover:underline">
                          <Download size={12} /> Télécharger
                        </button>
                      </div>
                      <p className="text-sm opacity-70 whitespace-pre-wrap italic">"{aifResult.parole_client}"</p>
                    </div>

                    {/* Note institutionnelle */}
                    <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.02]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold flex items-center gap-2">🏦 Note institutionnelle <span className="text-xs font-normal opacity-40">(conciergeries, family offices, banques privées)</span></h3>
                        <button onClick={() => downloadText(aifResult.note_institutionnelle, `note_institutionnelle_${aifForm.nom_actif || "actif"}.txt`)} className="text-xs flex items-center gap-1 text-[var(--accent)] hover:underline">
                          <Download size={12} /> Télécharger
                        </button>
                      </div>
                      <p className="text-sm opacity-70 whitespace-pre-wrap">{aifResult.note_institutionnelle}</p>
                    </div>

                    {/* Asset Briefing */}
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/[0.02]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold flex items-center gap-2">🔒 Asset Briefing <span className="text-xs font-normal opacity-40">(Post-NDA)</span></h3>
                        <button onClick={() => downloadText(aifResult.asset_briefing, `briefing_${aifForm.nom_actif || "actif"}.txt`)} className="text-xs flex items-center gap-1 text-[var(--accent)] hover:underline">
                          <Download size={12} /> Télécharger
                        </button>
                      </div>
                      <pre className="text-xs opacity-70 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">{aifResult.asset_briefing}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
