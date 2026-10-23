import React, { useState, useRef } from "react";
import { ZORROS_LIST } from "@/constants/zorrosData";
import { Volume2, VolumeX, Skull, Music, UserCheck } from "lucide-react";

export default function Navbar({ currentZorro, setCurrentZorro }) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlayingLocal, setIsPlayingLocal] = useState(false);
  const audioRef = useRef(null);

  const handleZorroChange = (e) => {
    const selected = e.target.value;
    setCurrentZorro(selected);
    if (typeof window !== "undefined") {
      localStorage.setItem("zorro_selected_name", selected);
    }
  };

  const toggleSound = () => {
    setShowPlayer(!showPlayer);
    if (audioRef.current) {
      if (isPlayingLocal) {
        audioRef.current.pause();
        setIsPlayingLocal(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlayingLocal(true))
          .catch(() => {
            // Si no existe el archivo local .mp3, se usa el mini-reproductor visual desplegable
          });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-desert-bg/95 backdrop-blur-md border-b border-desert-fox/40 px-3 py-2.5 shadow-lg">
      {/* Audio HTML5 oculto por si subes public/audio/a-lo-cubano.mp3 */}
      <audio ref={audioRef} src="/audio/a-lo-cubano.mp3" loop />

      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Logo y Título */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-desert-fox to-amber-900 border border-desert-gold shadow-md">
            <span className="text-lg">🦊</span>
            <Skull className="w-3.5 h-3.5 text-desert-bone absolute -bottom-1 -right-1 bg-desert-bg rounded-full p-0.5 border border-desert-fox" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider uppercase text-desert-bone leading-tight flex items-center gap-1">
              ZORROS <span className="text-desert-fox">OF THE DISERT</span>
            </h1>
            <p className="text-[10px] text-desert-muted uppercase tracking-widest">
              Hermandad del Desierto 💀
            </p>
          </div>
        </div>

        {/* Controles Derecha: Desplegable de Zorro + Botón Sonido */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex items-center">
            <UserCheck className="w-3.5 h-3.5 text-desert-fox absolute left-2 pointer-events-none" />
            <select
              value={currentZorro}
              onChange={handleZorroChange}
              className="bg-desert-card text-desert-bone text-xs font-bold pl-7 pr-5 py-1.5 rounded-lg border border-desert-fox/60 focus:outline-none focus:ring-2 focus:ring-desert-fox appearance-none cursor-pointer"
            >
              <option value="">¿Quién eres?</option>
              {ZORROS_LIST.map((name) => (
                <option key={name} value={name}>
                  🦊 {name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={toggleSound}
            title="Ambientar con Orishas - A lo cubano"
            className={`p-2 rounded-lg border transition-all ${
              showPlayer || isPlayingLocal
                ? "bg-desert-fox text-white border-desert-gold animate-pulse"
                : "bg-desert-card text-desert-muted border-stone-700 hover:text-desert-bone"
            }`}
          >
            {showPlayer || isPlayingLocal ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mini-Reproductor Desplegable: Orishas - A lo cubano */}
      {showPlayer && (
        <div className="max-w-md mx-auto mt-2 p-2.5 rounded-xl bg-desert-card border border-desert-fox/50 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-desert-gold flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" /> AMBIENTACIÓN: A LO CUBANO - ORISHAS
            </span>
            <button
              onClick={() => setShowPlayer(false)}
              className="text-[10px] text-desert-muted hover:text-white px-1.5 py-0.5 rounded bg-stone-800"
            >
              Ocultar
            </button>
          </div>
          {/* Reproductor oficial embebido de Spotify con "A lo cubano - Orishas" */}
          <iframe
            style={{ borderRadius: "8px" }}
            src="https://open.spotify.com/embed/track/4L3c6p2K3y9mG3d5mI2qO0?utm_source=generator&theme=0"
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      )}
    </header>
  );
}
