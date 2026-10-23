import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getVoterIdentity } from "@/lib/deviceAuth";
import { PlusCircle, ShieldAlert, CheckCircle2, BarChart3 } from "lucide-react";

const INITIAL_POLLS = [
  {
    id: "poll_default_1",
    question: "¿Dónde va a ser la próxima gran escapada de los Zorros?",
    author: "Belmon",
    options: [
      { text: "Repetir El Algarve a lo grande", votes: 4 },
      { text: "Casa rural en Asturias con sidra infinita", votes: 6 },
      { text: "Fin de semana salvaje en Oporto", votes: 5 },
    ],
    voters: [],
  },
];

export default function TabEncuestas({ currentZorro }) {
  const [polls, setPolls] = useState(INITIAL_POLLS);
  const [identity, setIdentity] = useState({ ip: "...", deviceId: "...", signature: "" });
  const [showCreate, setShowCreate] = useState(false);
  const [question, setQuestion] = useState("");
  const [optionsText, setOptionsText] = useState(["", ""]);
  const [errorMsg, setErrorMsg] = useState("");

  // Obtiene IP pública y huella del móvil al abrir la pestaña
  useEffect(() => {
    getVoterIdentity().then((idData) => setIdentity(idData));
  }, []);

  // Escucha encuestas en tiempo real desde Firebase
  useEffect(() => {
    try {
      const q = query(collection(db, "polls"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const loaded = snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            }));
            setPolls(loaded);
          }
        },
        () => {}
      );
      return () => unsubscribe();
    } catch (e) {}
  }, []);

  const handleAddOptionField = () => {
    if (optionsText.length < 5) {
      setOptionsText([...optionsText, ""]);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!currentZorro) {
      setErrorMsg("¡Selecciona tu nombre arriba antes de crear una encuesta!");
      return;
    }
    const cleanOptions = optionsText.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || cleanOptions.length < 2) {
      setErrorMsg("Escribe una pregunta y al menos 2 opciones.");
      return;
    }

    const newPollData = {
      question: question.trim(),
      author: currentZorro,
      options: cleanOptions.map((text) => ({ text, votes: 0 })),
      voters: [],
      createdAt: serverTimestamp(),
    };

    setPolls((prev) => [{ id: "local_" + Date.now(), ...newPollData }, ...prev]);
    setQuestion("");
    setOptionsText(["", ""]);
    setShowCreate(false);
    setErrorMsg("");

    try {
      await addDoc(collection(db, "polls"), newPollData);
    } catch (err) {
      console.warn("Encuesta creada en modo local.");
    }
  };

  const handleVote = async (poll, optionIdx) => {
    setErrorMsg("");
    if (!currentZorro) {
      setErrorMsg("⚠️ ¡Identifícate primero en el desplegable de arriba para poder votar!");
      return;
    }

    const voters = poll.voters || [];

    // 1. Comprobar si ese nombre de Zorro ya votó
    const nameAlreadyVoted = voters.find((v) => v.name === currentZorro);
    if (nameAlreadyVoted) {
      setErrorMsg(`🦊 ¡Alto ahí! ${currentZorro} ya ha votado en esta encuesta.`);
      return;
    }

    // 2. Comprobar si esa IP + Dispositivo (móvil) ya votó haciéndose pasar por otro
    const deviceAlreadyVoted = voters.find(
      (v) =>
        v.deviceId === identity.deviceId ||
        (identity.ip !== "ip_desconocida" &&
          v.ip === identity.ip &&
          v.deviceId === identity.deviceId)
    );

    if (deviceAlreadyVoted) {
      setErrorMsg(
        `💀 ¡CAZADO POR LA IP (${identity.ip})! Desde este móvil ya votó ${deviceAlreadyVoted.name}. ¡No vale cambiarse de nombre, te toca beber!`
      );
      return;
    }

    // Registrar voto válido
    const updatedOptions = poll.options.map((opt, idx) =>
      idx === optionIdx ? { ...opt, votes: opt.votes + 1 } : opt
    );
    const updatedVoters = [
      ...voters,
      {
        name: currentZorro,
        ip: identity.ip,
        deviceId: identity.deviceId,
        optionIdx,
      },
    ];

    // Actualización inmediata en pantalla
    setPolls((prev) =>
      prev.map((p) =>
        p.id === poll.id
          ? { ...p, options: updatedOptions, voters: updatedVoters }
          : p
      )
    );

    try {
      if (!poll.id.startsWith("poll_default") && !poll.id.startsWith("local_")) {
        const pollRef = doc(db, "polls", poll.id);
        await updateDoc(pollRef, {
          options: updatedOptions,
          voters: updatedVoters,
        });
      }
    } catch (err) {
      console.warn("Voto guardado en sesión local.");
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black uppercase text-desert-bone flex items-center gap-1.5">
            <BarChart3 className="w-5 h-5 text-desert-fox" /> Encuestas de la Manada
          </h2>
          <p className="text-[11px] text-desert-muted">
            1 voto por Zorro · IP verificada:{" "}
            <span className="text-desert-gold font-mono">{identity.ip}</span>
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-desert-fox text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-md active:scale-95"
        >
          <PlusCircle className="w-4 h-4" /> Crear
        </button>
      </div>

      {/* Alerta Anti-Trampas */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-bold flex items-center gap-2 animate-bounce">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Formulario para crear nueva encuesta */}
      {showCreate && (
        <form
          onSubmit={handleCreatePoll}
          className="bg-desert-card p-4 rounded-2xl border border-desert-gold space-y-3 shadow-xl"
        >
          <h3 className="text-xs font-black uppercase text-desert-gold">
            📊 Plantear nueva encuesta como {currentZorro || "..."}
          </h3>
          <input
            type="text"
            required
            placeholder="¿Qué quieres preguntarle a los Zorros?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full bg-desert-bg text-xs text-desert-bone p-3 rounded-xl border border-stone-700"
          />

          <div className="space-y-2">
            {optionsText.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                required={idx < 2}
                placeholder={`Opción ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  const copy = [...optionsText];
                  copy[idx] = e.target.value;
                  setOptionsText(copy);
                }}
                className="w-full bg-desert-bg text-xs text-desert-bone p-2.5 rounded-xl border border-stone-700"
              />
            ))}
          </div>

          {optionsText.length < 5 && (
            <button
              type="button"
              onClick={handleAddOptionField}
              className="text-xs text-desert-fox font-bold hover:underline"
            >
              + Añadir otra opción
            </button>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-desert-fox text-white text-xs font-bold py-2.5 rounded-xl"
            >
              Publicar Encuesta
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-4 bg-stone-800 text-desert-muted text-xs rounded-xl"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Listado de Encuestas */}
      <div className="space-y-4">
        {polls.map((poll) => {
          const totalVotes = poll.options.reduce((acc, o) => acc + o.votes, 0);
          const voters = poll.voters || [];
          const myVoteRecord = voters.find(
            (v) => v.deviceId === identity.deviceId || v.name === currentZorro
          );

          return (
            <div
              key={poll.id}
              className="bg-desert-card p-4 rounded-2xl border border-stone-800 shadow-lg space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-sm font-extrabold text-desert-bone">
                  {poll.question}
                </h3>
                <span className="text-[10px] bg-desert-bg px-2 py-0.5 rounded-full text-desert-gold border border-desert-gold/40 shrink-0">
                  Por 🦊 {poll.author}
                </span>
              </div>

              <div className="space-y-2">
                {poll.options.map((opt, idx) => {
                  const pct =
                    totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                  const isMyChoice = myVoteRecord?.optionIdx === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleVote(poll, idx)}
                      className={`w-full text-left p-3 rounded-xl border relative overflow-hidden transition-all ${
                        isMyChoice
                          ? "border-desert-fox bg-desert-bg"
                          : "border-stone-700 bg-desert-bg/70 hover:border-desert-gold"
                      }`}
                    >
                      {/* Barra de porcentaje de fondo */}
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-desert-fox/25 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                      <div className="relative z-10 flex items-center justify-between text-xs">
                        <span className="font-bold text-desert-bone flex items-center gap-1.5">
                          {isMyChoice && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-desert-fox" />
                          )}
                          {opt.text}
                        </span>
                        <span className="font-black text-desert-gold">
                          {pct}% ({opt.votes})
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pie con los nombres de los Zorros que ya han votado */}
              <div className="pt-1 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-desert-muted">
                <span>Total votos: {totalVotes}</span>
                {voters.length > 0 && (
                  <span className="truncate max-w-[210px]">
                    Han votado: {voters.map((v) => v.name).join(", ")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
