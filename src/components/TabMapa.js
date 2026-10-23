import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { DEFAULT_TRIPS } from "@/constants/zorrosData";
import { MapPin, PlusCircle, Camera, ExternalLink } from "lucide-react";

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] w-full rounded-2xl bg-desert-card border border-stone-800 flex items-center justify-center text-xs text-desert-muted">
      Cargando mapa de conquistas de los Zorros... 🦊🗺️
    </div>
  ),
});

// Coordenadas rápidas por si prefieren elegir de una lista además de tocar el mapa
const QUICK_PLACES = [
  { label: "Seleccionar o tocar en el mapa...", lat: "", lng: "" },
  { label: "El Algarve (Portugal)", lat: 37.0891, lng: -8.2479 },
  { label: "Galicia (A Coruña / Santiago / Rías Baixas)", lat: 42.8782, lng: -8.5448 },
  { label: "Asturias (Gijón / Oviedo)", lat: 43.5322, lng: -5.6611 },
  { label: "Madrid", lat: 40.4168, lng: -3.7038 },
  { label: "Andalucía (Sevilla / Málaga / Cádiz)", lat: 36.7213, lng: -4.4214 },
  { label: "Levante / Ibiza / Baleares", lat: 38.9067, lng: 1.4206 },
  { label: "Oporto / Norte de Portugal", lat: 41.1579, lng: -8.6291 },
];

export default function TabMapa({ currentZorro }) {
  const [trips, setTrips] = useState(DEFAULT_TRIPS);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [lat, setLat] = useState(37.0891);
  const [lng, setLng] = useState(-8.2479);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, "trips"),
        (snapshot) => {
          const loaded = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // Combina El Algarve por defecto con los viajes subidos a Firebase
          const hasAlgarve = loaded.some((t) =>
            t.title?.toLowerCase().includes("algarve")
          );
          setTrips(hasAlgarve ? loaded : [...DEFAULT_TRIPS, ...loaded]);
        },
        () => {}
      );
      return () => unsubscribe();
    } catch (e) {}
  }, []);

  const handleMapClickCoords = (clickedLat, clickedLng) => {
    setLat(Number(clickedLat.toFixed(4)));
    setLng(Number(clickedLng.toFixed(4)));
    setShowForm(true);
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTrip = {
      title: title.trim(),
      date: date.trim() || "Viaje Mítico",
      description: description.trim() || "Territorio conquistado por los Zorros.",
      photoUrl:
        photoUrl.trim() ||
        "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80",
      lat: Number(lat),
      lng: Number(lng),
      author: currentZorro || "Zorro Anónimo",
    };

    setTrips((prev) => [...prev, { id: "local_" + Date.now(), ...newTrip }]);
    setShowForm(false);
    setTitle("");
    setDate("");
    setDescription("");
    setPhotoUrl("");

    try {
      await addDoc(collection(db, "trips"), newTrip);
    } catch (err) {
      console.warn("Viaje añadido en modo local.");
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black uppercase text-desert-bone flex items-center gap-1.5">
            <span className="text-desert-fox text-xl leading-none">*</span> Mapa de Conquistas
          </h2>
          <p className="text-xs text-desert-muted">
            Toca un asterisco <strong className="text-desert-fox">*</strong> para ver la foto o toca el mapa para añadir otro viaje.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-desert-fox text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-md active:scale-95"
        >
          <PlusCircle className="w-4 h-4" /> Nuevo *
        </button>
      </div>

      {/* Mapa Interactivo */}
      <div className="rounded-2xl overflow-hidden border-2 border-desert-fox/50 shadow-xl">
        <MapInner trips={trips} onSelectCoords={handleMapClickCoords} />
      </div>

      {/* Formulario Modal/Desplegable para añadir un nuevo Asterisco */}
      {showForm && (
        <form
          onSubmit={handleAddTrip}
          className="bg-desert-card p-4 rounded-2xl border border-desert-gold space-y-3 shadow-xl animate-fadeIn"
        >
          <h3 className="text-xs font-black uppercase text-desert-gold">
            ➕ Clavar nuevo asterisco (*) en el mapa
          </h3>

          <select
            onChange={(e) => {
              const idx = e.target.value;
              if (QUICK_PLACES[idx]?.lat) {
                setLat(QUICK_PLACES[idx].lat);
                setLng(QUICK_PLACES[idx].lng);
                if (!title) setTitle(QUICK_PLACES[idx].label);
              }
            }}
            className="w-full bg-desert-bg text-xs text-desert-bone p-2.5 rounded-xl border border-stone-700"
          >
            {QUICK_PLACES.map((p, i) => (
              <option key={i} value={i}>
                📍 {p.label}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Lugar (ej: El Algarve)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-desert-bg text-xs text-desert-bone p-2.5 rounded-xl border border-stone-700"
            />
            <input
              type="text"
              placeholder="Año / Fecha (ej: Verano 2024)"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-desert-bg text-xs text-desert-bone p-2.5 rounded-xl border border-stone-700"
            />
          </div>

          <input
            type="url"
            placeholder="URL de la foto del grupo (Imgur, Google Fotos, Instagram...)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full bg-desert-bg text-xs text-desert-bone p-2.5 rounded-xl border border-stone-700"
          />

          <input
            type="text"
            placeholder="Anécdota corta de ese viaje..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-desert-bg text-xs text-desert-bone p-2.5 rounded-xl border border-stone-700"
          />

          <div className="text-[10px] text-desert-muted flex justify-between">
            <span>Coordenadas seleccionadas: {lat}, {lng}</span>
            <span>(Puedes tocar el mapa para moverlo)</span>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-desert-fox text-white text-xs font-bold py-2.5 rounded-xl"
            >
              Guardar Asterisco *
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 bg-stone-800 text-desert-muted text-xs rounded-xl"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Tarjetas de Viajes debajo del mapa */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-desert-muted px-1">
          Lugares Conquistados ({trips.length})
        </h3>
        {trips.map((t) => (
          <div
            key={t.id}
            className="flex gap-3 bg-desert-card p-3 rounded-2xl border border-stone-800 items-center"
          >
            {t.photoUrl && (
              <img
                src={t.photoUrl}
                alt={t.title}
                className="w-16 h-16 rounded-xl object-cover border border-desert-fox/50 shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-black text-desert-bone flex items-center gap-1">
                <span className="text-desert-fox text-lg leading-none">*</span> {t.title}
              </div>
              <p className="text-xs text-desert-muted truncate">{t.description}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-desert-gold">{t.date}</span>
                {t.photoUrl && (
                  <a
                    href={t.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-desert-fox font-bold flex items-center gap-1 hover:underline"
                  >
                    <Camera className="w-3 h-3" /> Ver foto <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
