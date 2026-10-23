import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Icono personalizado con el ASTERISCO (*) de los Zorros
const createAsteriskIcon = () =>
  L.divIcon({
    className: "custom-asterisk-marker",
    html: `<div style="
      width: 34px;
      height: 34px;
      background: #EA580C;
      color: #F5F5F4;
      border: 2px solid #F5F5F4;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 900;
      line-height: 1;
      padding-top: 6px;
      box-shadow: 0 0 14px rgba(234, 88, 12, 0.95);
    ">*</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  });

function MapClickHandler({ onSelectCoords }) {
  useMapEvents({
    click(e) {
      onSelectCoords(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapInner({ trips, onSelectCoords }) {
  const asteriskIcon = createAsteriskIcon();

  return (
    <MapContainer
      center={[39.8, -4.2]} // Centrado en España y Portugal (Península Ibérica)
      zoom={5}
      style={{ height: "380px", width: "100%", borderRadius: "16px", zIndex: 10 }}
    >
      {/* Mapa oscuro estilo desierto nocturno */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <MapClickHandler onSelectCoords={onSelectCoords} />

      {trips.map((trip) => (
        <Marker
          key={trip.id}
          position={[Number(trip.lat), Number(trip.lng)]}
          icon={asteriskIcon}
        >
          <Popup>
            <div className="w-52 text-desert-bone p-1">
              <div className="text-xs font-black text-desert-fox uppercase">
                * {trip.title}
              </div>
              <div className="text-[10px] text-desert-muted mb-1.5">
                📅 {trip.date} · Por {trip.author || "Los Zorros"}
              </div>
              {trip.photoUrl && (
                <a
                  href={trip.photoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-2"
                >
                  <img
                    src={trip.photoUrl}
                    alt={trip.title}
                    className="w-full h-28 object-cover rounded-lg border border-desert-fox/60"
                  />
                  <span className="text-[10px] text-desert-gold underline block mt-1 text-center">
                    🔍 Toca para abrir la foto en grande
                  </span>
                </a>
              )}
              <p className="text-xs leading-snug">{trip.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
