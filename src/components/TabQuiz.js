import React, { useState } from "react";
import { QUIZ_QUESTIONS } from "@/constants/zorrosData";
import confetti from "canvas-confetti";
import { Trophy, RotateCcw, CheckCircle2, XCircle } from "lucide-react";

export default function TabQuiz({ currentZorro }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    const isCorrect = idx === currentQ.correctIndex;
    const updatedScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(updatedScore);

    setTimeout(() => {
      if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
        setCurrentIdx(currentIdx + 1);
        setSelectedOption(null);
      } else {
        setFinished(true);
        if (updatedScore >= 7) {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        }
      }
    }, 1100);
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setFinished(false);
  };

  const getRankMessage = () => {
    if (score === 10) return "🦊💀 ¡ZORRO SUPREMO DEL DESIERTO! Te sabes toda la biblia del grupo.";
    if (score >= 7) return "🍺 ¡Zorro de Pura Cepa! Estás en todas las batallas importantes.";
    if (score >= 4) return "🌵 Zorro Despistado... Te pierdes más que Geno por las noches.";
    return "💀 Forastero total. Te toca beber un hidalgo por no enterarte de nada.";
  };

  if (finished) {
    return (
      <div className="bg-desert-card p-6 rounded-2xl border border-desert-fox text-center space-y-4 my-4 shadow-2xl">
        <Trophy className="w-16 h-16 text-desert-gold mx-auto animate-bounce" />
        <h2 className="text-xl font-black uppercase text-desert-bone">
          Resultado de {currentZorro || "este Zorro"}
        </h2>
        <div className="text-5xl font-black text-desert-fox">
          {score} / {QUIZ_QUESTIONS.length}
        </div>
        <p className="text-sm text-desert-bone bg-desert-bg p-3.5 rounded-xl border border-stone-800">
          {getRankMessage()}
        </p>
        <button
          onClick={resetQuiz}
          className="w-full bg-desert-fox text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
        >
          <RotateCcw className="w-4 h-4" /> Jugar otra vez
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Cabecera de Progreso */}
      <div className="flex items-center justify-between text-xs font-bold text-desert-muted">
        <span>
          PREGUNTA {currentIdx + 1} DE {QUIZ_QUESTIONS.length}
        </span>
        <span className="text-desert-gold">ACIERTOS: {score} 🦊</span>
      </div>

      <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-desert-fox h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Tarjeta de Pregunta */}
      <div className="bg-desert-card p-5 rounded-2xl border border-stone-800 shadow-xl space-y-4">
        <h3 className="text-base font-extrabold text-desert-bone leading-snug">
          {currentQ.question}
        </h3>

        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            let btnStyle =
              "bg-desert-bg border-stone-700 text-desert-bone hover:border-desert-fox";
            if (selectedOption !== null) {
              if (idx === currentQ.correctIndex) {
                btnStyle = "bg-green-900/50 border-green-500 text-green-200 font-bold";
              } else if (idx === selectedOption) {
                btnStyle = "bg-red-900/50 border-red-500 text-red-200";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {selectedOption !== null && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                )}
                {selectedOption === idx && idx !== currentQ.correctIndex && (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
