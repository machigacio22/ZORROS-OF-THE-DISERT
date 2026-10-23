import React, { useState } from "react";
import {
  ZORROS_LIST,
  IMMUNE_ZORROS,
  ROULETTE_ACTIONS,
} from "@/constants/zorrosData";
import confetti from "canvas-confetti";
import { Dices, Skull, Sparkles } from "lucide-react";

// Componente visual de Ruleta SVG con aguja superior
function WheelCanvas({ items, rotation, size = 270, title }) {
  const num = items.length;
  const anglePerSlice = 360 / num;
  const radius = size / 2;

  const colors = ["#1E1A17", "#EA580C", "#292524", "#D97706"];

  return (
    <div className="flex flex-col items-center">
      {title && (
        <span className="text-xs font-black uppercase tracking-wider text-desert-gold mb-2">
          {title}
        </span>
      )}
      <div className="relative flex items-center justify-center">
        {/* Aguja indicadora fija arriba (a las 12 en punto) */}
        <div
          className="absolute -top-3 z-20 w-0 h-0"
          style={{
            borderLeft: "11px solid transparent",
            borderRight: "11px solid transparent",
            borderTop: "22px solid #F5F5F4",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.9))",
          }}
        />

        {/* Rueda Giratoria */}
        <div
          style={{
            width: size,
            height: size,
            transform: `rotate(${rotation}deg)`,
            transition: "transform 4.2s cubic-bezier(0.15, 0.85, 0.25, 1)",
          }}
          className="rounded-full border-4 border-desert-gold shadow-2xl overflow-hidden relative bg-desert-card"
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g transform={`translate(${radius}, ${radius})`}>
              {items.map((label, i) => {
                const startAngle = (i * anglePerSlice - 90) * (Math.PI / 180);
                const endAngle =
                  ((i + 1) * anglePerSlice - 90) * (Math.PI / 180);
                const x1 = radius * Math.cos(startAngle);
                const y1 = radius * Math.sin(startAngle);
                const x2 = radius * Math.cos(endAngle);
                const y2 = radius * Math.sin(endAngle);
                const midAngle = (i + 0.5) * anglePerSlice - 90;

                const d = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
                const fill = colors[i % colors.length];

                // Acortar texto largo en el quesito visual para que quepa limpio
                const shortLabel =
                  label.length > 14 ? label.substring(0, 12) + "…" : label;

                return (
                  <g key={i}>
                    <path
                      d={d}
                      fill={fill}
                      stroke="#121212"
                      strokeWidth="1"
                    />
                    <text
                      transform={`rotate(${midAngle}) translate(${
                        radius * 0.62
                      }, 3)`}
                      textAnchor="middle"
                      fill="#F5F5F4"
                      fontSize={num > 15 ? "8.5" : "10"}
                      fontWeight="bold"
                    >
                      {shortLabel}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Centro de la ruleta con calavera */}
          <div className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-desert-bg border-2 border-desert-gold flex items-center justify-center shadow-inner">
            <Skull className="w-5 h-5 text-desert-fox" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TabSorteo() {
  const [mode, setMode] = useState("single"); // "single" (1 ruleta) | "double" (2 ruletas)
  const [spinning, setSpinning] = useState(false);
  const [rotZorros, setRotZorros] = useState(0);
  const [rotActions, setRotActions] = useState(0);
  const [winnerZorro, setWinnerZorro] = useState(null);
  const [winnerAction, setWinnerAction] = useState(null);

  // MOTOR SECRETO: Elige un índice de Zorro garantizando que NUNCA sea Hermo ni Cambeiro
  const pickEligibleZorroIndex = () => {
    const validIndices = ZORROS_LIST.map((name, index) => ({
      name,
      index,
    })).filter((item) => !IMMUNE_ZORROS.includes(item.name));

    const randomPick =
      validIndices[Math.floor(Math.random() * validIndices.length)];
    return randomPick.index;
  };

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinnerZorro(null);
    setWinnerAction(null);

    // 1. Calcular ganador de la Ruleta de Zorros (excluyendo a Hermo y Cambeiro)
    const chosenZorroIdx = pickEligibleZorroIndex();
    const sliceZorro = 360 / ZORROS_LIST.length;
    const targetAngleZorro = 360 - (chosenZorroIdx + 0.5) * sliceZorro;
    const extraSpinsZ = (Math.floor(Math.random() * 3) + 6) * 360; // 6 a 8 vueltas completas
    const currentBaseZ = rotZorros - (rotZorros % 360);
    const nextRotZ = currentBaseZ + extraSpinsZ + targetAngleZorro;
    setRotZorros(nextRotZ);

    // 2. Si estamos en el modo de 2 Ruletas, girar también la Ruleta de Pruebas
    let chosenActionIdx = 0;
    if (mode === "double") {
      chosenActionIdx = Math.floor(Math.random() * ROULETTE_ACTIONS.length);
      const sliceAction = 360 / ROULETTE_ACTIONS.length;
      const targetAngleAction = 360 - (chosenActionIdx + 0.5) * sliceAction;
      const extraSpinsA = (Math.floor(Math.random() * 3) + 6) * 360;
      const currentBaseA = rotActions - (rotActions % 360);
      const nextRotA = currentBaseA + extraSpinsA + targetAngleAction;
      setRotActions(nextRotA);
    }

    // Mostrar el resultado cuando termina la animación de 4.2 segundos
    setTimeout(() => {
      setSpinning(false);
      setWinnerZorro(ZORROS_LIST[chosenZorroIdx]);
      if (mode === "double") {
        setWinnerAction(ROULETTE_ACTIONS[chosenActionIdx]);
      }
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 } });
    }, 4250);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Selector de Modo de Sorteo */}
      <div className="grid grid-cols-2 gap-2 bg-desert-card p-1.5 rounded-2xl border border-stone-800">
        <button
          onClick={() => {
            if (!spinning) {
              setMode("single");
              setWinnerZorro(null);
              setWinnerAction(null);
            }
          }}
          className={`py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
            mode === "single"
              ? "bg-desert-fox text-white shadow-md"
              : "text-desert-muted hover:text-desert-bone"
          }`}
        >
          🎯 1 Ruleta (Zorro)
        </button>
        <button
          onClick={() => {
            if (!spinning) {
              setMode("double");
              setWinnerZorro(null);
              setWinnerAction(null);
            }
          }}
          className={`py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
            mode === "double"
              ? "bg-desert-fox text-white shadow-md"
              : "text-desert-muted hover:text-desert-bone"
          }`}
        >
          🍻 2 Ruletas (Zorro + Prueba)
        </button>
      </div>

      {/* Contenedor de las Ruletas */}
      <div className="bg-desert-card p-4 rounded-2xl border border-stone-800 shadow-xl flex flex-col items-center gap-6">
        <WheelCanvas
          items={ZORROS_LIST}
          rotation={rotZorros}
          size={mode === "single" ? 285 : 245}
          title="Ruleta de los 26 Zorros"
        />

        {mode === "double" && (
          <WheelCanvas
            items={ROULETTE_ACTIONS}
            rotation={rotActions}
            size={245}
            title="Ruleta de Actuaciones"
          />
        )}

        {/* Botón de Girar */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className={`w-full py-3.5 rounded-2xl font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
            spinning
              ? "bg-stone-700 text-stone-400 cursor-not-allowed"
              : "bg-gradient-to-r from-desert-fox to-desert-gold text-white active:scale-95"
          }`}
        >
          <Dices className={`w-5 h-5 ${spinning ? "animate-spin" : ""}`} />
          {spinning
            ? "Girando la fortuna del desierto..."
            : mode === "single"
            ? "¡Girar Ruleta!"
            : "¡Girar las 2 Ruletas!"}
        </button>
      </div>

      {/* Cartel de Ganador / Castigo */}
      {winnerZorro && (
        <div className="bg-gradient-to-br from-desert-fox/25 via-desert-card to-stone-900 p-5 rounded-2xl border-2 border-desert-fox text-center space-y-2 shadow-2xl animate-fadeIn">
          <div className="text-xs font-black uppercase text-desert-gold flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" /> ¡El desierto ha hablado!
          </div>
          <div className="text-2xl font-black text-desert-bone">
            🦊 Le ha tocado a:{" "}
            <span className="text-desert-fox underline">{winnerZorro}</span>
          </div>

          {mode === "double" && winnerAction && (
            <div className="mt-3 p-3.5 rounded-xl bg-desert-bg border border-desert-gold/60">
              <span className="text-[10px] uppercase font-bold text-desert-muted block mb-1">
                Actuación obligatoria:
              </span>
              <p className="text-base font-black text-desert-gold">
                “{winnerAction}” 💀🍺
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
