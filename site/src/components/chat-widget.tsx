"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const INTENTS = [
  { label: "Acheter", href: "/biens" },
  { label: "Vendre", href: "/vendre" },
  { label: "Je recherche un bien spécifique...", href: "/contact?intention=sur-mesure" },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-80 bg-white border border-muted/30 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-primary text-on-primary px-5 py-4 flex items-center justify-between">
            <span className="font-title-card text-title-card">Conciergerie UPRE</span>
            <button onClick={() => setOpen(false)} aria-label="Fermer" className="opacity-70 hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <div className="p-5">
            <p className="font-body-md text-body-md text-on-surface-variant mb-5">Quelle est votre intention ?</p>
            <div className="flex flex-col gap-2">
              {INTENTS.map((intent) => (
                <button
                  key={intent.label}
                  onClick={() => router.push(intent.href)}
                  className="text-left px-4 py-3 border border-muted hover:border-primary hover:bg-surface-container-low transition-colors font-label-caps text-[13px] text-primary"
                >
                  {intent.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ouvrir la conciergerie"
        className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xl hover:bg-primary-container transition-colors"
      >
        <span className="material-symbols-outlined text-2xl">
          {open ? "close" : "chat"}
        </span>
      </button>
    </div>
  );
}
