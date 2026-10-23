import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { ZORROS_LIST } from "@/constants/zorrosData";
import { Send, Skull, Flame, UserCheck } from "lucide-react";

const FALLBACK_MESSAGES = [
  {
    id: "m1",
    author: "Belmon",
    text: "¡Bienvenidos al cubil oficial de los Zorros of the Disert! 🦊💀",
    createdAt: "Hace un momento",
  },
  {
    id: "m2",
    author: "Javichas",
    text: "Oye, ¿alguien sabe dónde está Geno? Primer aviso.",
    createdAt: "Hace 5 min",
  },
];

export default function TabCubil({ currentZorro, setCurrentZorro }) {
  const [messages, setMessages] = useState(FALLBACK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const loaded = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                author: data.author,
                text: data.text,
                createdAt: data.timestamp?.toDate
                  ? data.timestamp.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Ahora",
              };
            });
            setMessages(loaded);
          }
        },
        () => {
          // Si Firebase aún no está configurado, mantiene los mensajes locales
        }
      );
      return () => unsubscribe();
    } catch (err) {
      // Modo local sin Firebase
    }
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentZorro) {
      alert("¡Primero identifícate como uno de los 26 Zorros!");
      return;
    }
    if (!newMessage.trim()) return;

    const textToSend = newMessage.trim();
    setNewMessage("");
    setSending(true);

    // Actualización optimista inmediata en pantalla
    const tempMsg = {
      id: "local_" + Date.now(),
      author: currentZorro,
      text: textToSend,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [tempMsg, ...prev]);

    try {
      await addDoc(collection(db, "messages"), {
        author: currentZorro,
        text: textToSend,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.warn("Guardado en modo local (revisa tus claves de Firebase).");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Banner Desértico de Bienvenida e Identificación */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-desert-card via-stone-900 to-desert-bg border border-desert-fox/50 shadow-xl relative overflow-hidden">
        <Skull className="w-24 h-24 text-desert-fox/10 absolute -right-4 -bottom-4 rotate-12 pointer-events-none" />

        <div className="flex items-center gap-2 text-desert-fox font-black text-xs uppercase tracking-widest mb-1">
          <Flame className="w-4 h-4" /> El Cubil del Desierto
        </div>
        <h2 className="text-lg font-extrabold text-desert-bone">
          {currentZorro
            ? `¡Qué pasa, ${currentZorro}! 🦊💀`
            : "Identifícate, forastero"}
        </h2>
        <p className="text-xs text-desert-muted mt-1">
          Elige tu nombre en la lista oficial de los 26 Zorros para dejar tu mensaje en el muro o participar en la manada.
        </p>

        {/* Selector rápido de Zorro dentro del Cubil */}
        <div className="mt-3 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-desert-gold shrink-0" />
          <select
            value={currentZorro}
            onChange={(e) => {
              setCurrentZorro(e.target.value);
              localStorage.setItem("zorro_selected_name", e.target.value);
            }}
            className="w-full bg-desert-bg text-desert-bone text-xs font-bold px-3 py-2.5 rounded-xl border border-desert-gold/60 focus:outline-none focus:ring-2 focus:ring-desert-fox"
          >
            <option value="">-- Selecciona quién de los 26 Zorros eres --</option>
            {ZORROS_LIST.map((z) => (
              <option key={z} value={z}>
                🦊 {z}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Formulario para enviar mensaje */}
      <form
        onSubmit={handleSendMessage}
        className="bg-desert-card p-3 rounded-2xl border border-stone-800 shadow-md flex gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            currentZorro
              ? `Escribe algo en el muro como ${currentZorro}...`
              : "Primero selecciona tu nombre arriba..."
          }
          className="flex-1 bg-desert-bg text-desert-bone text-sm px-3.5 py-2.5 rounded-xl border border-stone-700 focus:outline-none focus:border-desert-fox"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-desert-fox hover:bg-orange-700 text-white font-bold px-4 rounded-xl flex items-center justify-center transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Lista de Mensajes en Tiempo Real */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-desert-muted px-1">
          Últimos rugidos de la manada ({messages.length})
        </h3>

        {messages.map((msg) => {
          const isMe = msg.author === currentZorro;
          return (
            <div
              key={msg.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isMe
                  ? "bg-desert-fox/15 border-desert-fox/60 ml-4"
                  : "bg-desert-card border-stone-800 mr-4"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-desert-gold flex items-center gap-1">
                  🦊 {msg.author}
                </span>
                <span className="text-[10px] text-desert-muted">
                  {msg.createdAt}
                </span>
              </div>
              <p className="text-sm text-desert-bone leading-relaxed break-words">
                {msg.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
