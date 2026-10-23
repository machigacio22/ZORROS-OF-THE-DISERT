import React, { useState, useEffect } from "react";
import { MYTHIC_QUOTES, ZORROS_LIST } from "@/constants/zorrosData";
import { Quote, Flame, ArrowRight } from "lucide-react";

export default function TabFrases() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [streak, setStreak] = useState(0);

  const currentQuote = MYTHIC_QUOTES[quoteIdx];

  // Genera 4 nombres de Zorros (1 verdadero + 3 falsos aleatorios)
  useEffect(() => {
    const correct = currentQuote.author;
    const others = ZORROS_LIST.filter((name) => name !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const mixed = [correct, ...others].sort(() => 0.5 - Math.random());
    setOptions(mixed);
    setSelectedAuthor(null);
  }, [quoteIdx]);

  const handleGuess = (name) => {
    if (selectedAuthor) return;
    setSelectedAuthor(name);
    if (name === currentQuote.author) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % MYTHIC_QUOTES.length);
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black uppercase text-desert-bone">
            ¿Quién soltó esta perla?
          </h2>
          <p className="text-xs text-desert-muted">
            Adivina qué Zorro dijo cada frase mítica
          </p>
        </div>
        <div className="bg-desert-card px-3 py-1.5 rounded-xl border border-desert-gold/50 text-xs font-black text-desert-gold flex items-center gap-1">
          <Flame className="w-4 h-4 text-desert-fox" /> Racha: {streak}
        </div>
      </div>

      {/* Tarjeta con la Frase Mítica */}
      <div className="bg-gradient-to-br from-desert-card to-stone-900 p-6 rounded-2xl border border-desert-fox/50 shadow-xl relative">
        <Quote className="w-10 h-10 text-desert-fox/20 absolute top-3 left-3" />
        <p className="text-lg font-extrabold text-desert-bone text-center italic relative z-10 py-4">
          “{currentQuote.quote}”
        </p>
      </div>

      {/* 4 Botones con nombres de Zorros */}
      <div className="grid grid-cols-2 gap-2.5">
        {options.map((name) => {
          let style = "bg-desert-card border-stone-700 text-desert-bone";
          if (selectedAuthor) {
            if (name === currentQuote.author) {
              style = "bg-green-900/60 border-green-400 text-green-200 font-black";
            } else if (name === selectedAuthor) {
              style = "bg-red-900/60 border-red-500 text-red-200";
            }
          }

          return (
            <button
              key={name}
              onClick={() => handleGuess(name)}
              className={`p-4 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${style}`}
            >
              🦊 {name}
            </button>
          );
        })}
      </div>

      {/* Resultado y botón de siguiente frase */}
      {selectedAuthor && (
        <div className="bg-desert-card p-4 rounded-2xl border border-stone-800 flex items-center justify-between animate-fadeIn">
          <div className="text-xs">
            {selectedAuthor === currentQuote.author ? (
              <span className="text-green-400 font-bold">
                ¡Clavado! Fue el mítico {currentQuote.author}.
              </span>
            ) : (
              <span className="text-red-400 font-bold">
                ¡Fallo! Esa joya la dijo {currentQuote.author} (te toca beber).
              </span>
            )}
          </div>
          <button
            onClick={nextQuote}
            className="bg-desert-fox text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 shrink-0"
          >
            Siguiente <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
