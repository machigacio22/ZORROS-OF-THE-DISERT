import React from "react";
import {
  MessageSquareFlame,
  MapPin,
  HelpCircle,
  Quote,
  BarChart3,
  Dices,
} from "lucide-react";

const TABS = [
  { id: "cubil", label: "El Cubil", icon: MessageSquareFlame },
  { id: "mapa", label: "Viajes *", icon: MapPin },
  { id: "quiz", label: "Quiz 10", icon: HelpCircle },
  { id: "frases", label: "Frases", icon: Quote },
  { id: "encuestas", label: "Encuestas", icon: BarChart3 },
  { id: "sorteo", label: "Sorteo", icon: Dices },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-desert-bg/95 backdrop-blur-md border-t border-desert-fox/40 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-6 gap-0.5 px-1 py-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                isActive
                  ? "bg-desert-fox/20 text-desert-fox font-extrabold scale-105"
                  : "text-desert-muted hover:text-desert-bone"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-desert-fox" : ""}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
