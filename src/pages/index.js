import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import TabCubil from "@/components/TabCubil";
import TabMapa from "@/components/TabMapa";
import TabQuiz from "@/components/TabQuiz";
import TabFrases from "@/components/TabFrases";
import TabEncuestas from "@/components/TabEncuestas";
import TabSorteo from "@/components/TabSorteo";

export default function Home() {
  const [activeTab, setActiveTab] = useState("cubil");
  const [currentZorro, setCurrentZorro] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zorro_selected_name");
      if (saved) setCurrentZorro(saved);
    }
  }, []);

  return (
    <div className="min-h-screen desert-bg-gradient text-desert-bone flex flex-col">
      {/* Cabecera Fija con Selector de Zorro y Audio de Orishas */}
      <Navbar currentZorro={currentZorro} setCurrentZorro={setCurrentZorro} />

      {/* Contenido Dinámico de la Pestaña Activa */}
      <main className="flex-1 w-full max-w-md mx-auto px-3.5 pt-4">
        {activeTab === "cubil" && (
          <TabCubil
            currentZorro={currentZorro}
            setCurrentZorro={setCurrentZorro}
          />
        )}
        {activeTab === "mapa" && <TabMapa currentZorro={currentZorro} />}
        {activeTab === "quiz" && <TabQuiz currentZorro={currentZorro} />}
        {activeTab === "frases" && <TabFrases />}
        {activeTab === "encuestas" && (
          <TabEncuestas currentZorro={currentZorro} />
        )}
        {activeTab === "sorteo" && <TabSorteo />}
      </main>

      {/* Barra de Navegación Inferior Móvil */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
