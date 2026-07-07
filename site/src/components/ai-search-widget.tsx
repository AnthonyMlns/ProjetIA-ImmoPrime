"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "assistant" | "user";
  text: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  text: "Bienvenue chez UPRE. Comment puis-je vous aider dans votre recherche d'exception aujourd'hui ?",
};

const SUGGESTIONS = [
  "Une villa avec vue mer à Saint-Tropez",
  "Un penthouse contemporain à Cannes",
  "Un domaine viticole dans l'arrière-pays",
  "Un appartement haussmannien à Paris",
];

const AI_RESPONSES: Record<string, string> = {
  villa: "Excellent choix. Nous avons actuellement plusieurs villas d'exception avec vue mer. Souhaitez-vous que je vous présente notre Villa Contemporaine à Cannes (320 m², 7 800 000 €) ou préférez-vous affiner par budget et surface ?",
  penthouse: "Les penthouses sont notre spécialité. Je vous recommande notre Penthouse Panoramique sur la Promenade des Anglais à Nice — 280 m², terrasse de 120 m². Souhaitez-vous plus de détails ?",
  domaine: "Les domaines viticoles font partie de notre catalogue Off-Market. Je peux vous mettre en relation avec un conseiller dédié pour une visite privée. Souhaitez-vous que je vous rappelle ?",
  paris: "Paris reste une valeur sûre. Nous avons plusieurs hôtels particuliers et appartements de prestige dans les beaux quartiers. Quel arrondissement vous intéresse ?",
  saint: "Saint-Tropez est l'une de nos destinations phares. Nous y avons plusieurs propriétés d'exception, notamment des villas les pieds dans l'eau et des bastides provençales. Quel style recherchez-vous ?",
  default:
    "Merci pour votre message. Je transmets votre demande à l'un de nos conseillers dédiés qui vous recontactera dans les plus brefs délais pour affiner votre recherche. En attendant, vous pouvez parcourir notre catalogue de biens d'exception.",
};

function matchResponse(query: string): string {
  const q = query.toLowerCase();
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (q.includes(key)) return response;
  }
  return AI_RESPONSES.default;
}

export function AISearchWidget({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const response = matchResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
      setLoading(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage(input);
  };

  return (
    <div className={`relative w-full max-w-2xl bg-white/10 backdrop-blur-md border border-gated-gold/30 rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      <div ref={messagesContainerRef} className="p-6 space-y-4 min-h-[180px] max-h-[320px] overflow-y-auto flex flex-col">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gated-gold flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white text-sm">auto_awesome</span>
              </div>
            )}
            <div
              className={`p-4 rounded-2xl shadow-sm max-w-[85%] ${
                m.role === "assistant"
                  ? "bg-surface-container-lowest/90 rounded-tl-none"
                  : "bg-primary text-on-primary rounded-tr-none"
              }`}
            >
              <p className="font-body-md text-sm leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gated-gold flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-sm">auto_awesome</span>
            </div>
            <div className="bg-surface-container-lowest/90 p-4 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gated-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gated-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gated-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-surface-container-lowest/95 border-t border-white/20">
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="px-3 py-1.5 text-xs border border-muted/40 rounded-full hover:border-gated-gold hover:text-gated-gold transition-colors font-body-md text-on-surface-variant"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <p className="font-label-caps text-[10px] text-text-subtle uppercase tracking-widest mb-3 ml-1">
          Décrivez le bien de vos rêves
        </p>
        <div className="relative flex items-center gap-3 bg-white border border-muted/20 rounded-xl px-4 py-2">
          <button className="text-text-subtle hover:text-primary transition-colors" aria-label="Joindre un fichier">
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none focus:ring-0 font-body-md text-primary py-2 placeholder:text-text-subtle/60 outline-none"
            placeholder="Décrivez votre projet immobilier..."
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2">
            <button className="text-text-subtle hover:text-primary transition-colors" aria-label="Dictée vocale">
              <span className="material-symbols-outlined">mic</span>
            </button>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="bg-primary text-on-primary p-2 rounded-lg hover:bg-gated-gold transition-all flex items-center justify-center disabled:opacity-40"
              aria-label="Envoyer"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
