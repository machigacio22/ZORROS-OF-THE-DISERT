// 1. LISTA OFICIAL DE LOS 26 ZORROS
export const ZORROS_LIST = [
  "Belmon",
  "Casti",
  "Alex",
  "Alvaro",
  "Antón",
  "Dani",
  "Emilio",
  "Fedi",
  "Hermo",
  "Cambeiro",
  "Hugo",
  "Geno",
  "Jacobo",
  "Fran",
  "Espa",
  "Guille",
  "Javichas",
  "Javito",
  "Fraga",
  "García",
  "Román",
  "Xabi",
  "Santi",
  "Xaquín",
  "Liñares",
  "Pintos",
];

// 2. LISTA SECRETA DE INMUNES EN LA RULETA (Aparecen en el dibujo pero nunca les toca)
export const IMMUNE_ZORROS = ["Hermo", "Cambeiro"];

// 3. ACTUACIONES DE LA SEGUNDA RULETA
export const ROULETTE_ACTIONS = [
  "Beber un hidalgo",
  "Bebe de tu caña",
  "Canta: CON MI LORO",
  "Di en alto una frase mítica",
  "Nombra a una tía a la que te pillaste",
  "Pregunta en alto: OYE, ¿DÓNDE ESTÁ GENO?",
  "Di en alto: ¿Quién fuma? Y quien responda: El puma. Bebe",
];

// 4. VIAJE INICIAL POR DEFECTO EN EL MAPA
export const DEFAULT_TRIPS = [
  {
    id: "trip_algarve_default",
    title: "Conquista de El Algarve",
    date: "Verano Mítico",
    lat: 37.0891,
    lng: -8.2479, // Albufeira / El Algarve
    description: "Territorio conquistado por la manada. Sol, cañas y leyendas de los Zorros.",
    photoUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=80",
    author: "Manada Zorros",
  },
];

// 5. 10 PREGUNTAS DE PRUEBA PARA EL QUIZ (Fáciles de sustituir por las tuyas)
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "¿Qué es lo primero que se escucha cuando la noche se empieza a descontrolar?",
    options: [
      "¡Nos vamos a dormir ya!",
      "OYE, ¿DÓNDE ESTÁ GENO?",
      "Un silencio sepulcral",
      "Póngame un vaso de agua tibia",
    ],
    correctIndex: 1,
  },
  {
    id: 2,
    question: "Si alguien grita en mitad del bar '¿Quién fuma?', ¿qué pasa con el que responde 'El puma'?",
    options: [
      "Le dan un premio",
      "Le toca conducir a la vuelta",
      "Bebe inmediatamente",
      "Se libra de pagar la ronda",
    ],
    correctIndex: 2,
  },
  {
    id: 3,
    question: "¿En qué destino internacional dejaron huella los Zorros con su mítica excursión?",
    options: [
      "En los fiordos noruegos",
      "En El Algarve",
      "En Cancún",
      "En la muralla china",
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "¿Cuál es el himno oficial que suena cuando se activa el modo 'Zorros of the disert'?",
    options: [
      "A lo cubano - Orishas",
      "Las cuatro estaciones de Vivaldi",
      "Ave María de Bisbal",
      "La Macarena",
    ],
    correctIndex: 0,
  },
  {
    id: 5,
    question: "Si la ruleta del desierto ordena 'Beber un hidalgo', ¿qué significa exactamente?",
    options: [
      "Dar un sorbito pequeño con elegancia",
      "Dejar el vaso en la barra y huir",
      "Bebérselo entero de un trago sin respirar",
      "Invitar a una ronda al camarero",
    ],
    correctIndex: 2,
  },
  {
    id: 6,
    question: "¿Quién de estos Zorros es capaz de perderse hasta dentro de su propia habitación en un viaje?",
    options: ["Geno", "Belmon", "Casti", "Javichas"],
    correctIndex: 0,
  },
  {
    id: 7,
    question: "Cuando suena el grito de guerra '¡CON MI LORO!', ¿qué hay que hacer?",
    options: [
      "Buscar una jaula",
      "Cantarlo a pleno pulmón como si no hubiera un mañana",
      "Llamar a Xaquín",
      "Pedir la cuenta",
    ],
    correctIndex: 1,
  },
  {
    id: 8,
    question: "¿Quién es el primero en liar al grupo diciendo 'tomamos una tranquila y para casa'?",
    options: ["Fraga", "Espa", "Cambeiro", "Cualquiera de los 26 Zorros"],
    correctIndex: 3,
  },
  {
    id: 9,
    question: "En una votación oficial de los Zorros, ¿qué pasa si intentas votar dos veces cambiando tu nombre?",
    options: [
      "Cuela sin problema",
      "El detector del desierto te pilla la IP y te bloquea",
      "Te regalan un chupito",
      "Se borra la app",
    ],
    correctIndex: 1,
  },
  {
    id: 10,
    question: "¿Cuántos miembros forman la alineación oficial de 'Zorros of the disert'?",
    options: ["12", "20", "26", "35"],
    correctIndex: 2,
  },
];

// 6. FRASES MÍTICAS DE PRUEBA PARA EL JUEGO "¿QUIÉN DIJO QUÉ?"
export const MYTHIC_QUOTES = [
  {
    id: 1,
    quote: "Oye, en serio... ¿dónde está Geno? Que hace media hora que dijo que iba al baño.",
    author: "Belmon",
  },
  {
    id: 2,
    quote: "Yo hoy salgo suave, me tomo dos cañas y a las doce estoy en cama.",
    author: "Casti",
  },
  {
    id: 3,
    quote: "¡CON MI LORO! Pon otra vez esa canción que aún no nos han echado del local.",
    author: "Javichas",
  },
  {
    id: 4,
    quote: "En El Algarve las rotondas no se hacen, se conquistan.",
    author: "Hermo",
  },
  {
    id: 5,
    quote: "No estoy borracho, es que el suelo de este bar tiene desnivel.",
    author: "Espa",
  },
  {
    id: 6,
    quote: "Si hacemos un hidalgo ahora mismo, mañana nos levantamos como nuevos.",
    author: "Cambeiro",
  },
  {
    id: 7,
    quote: "¿Quién fuma? ¡Que alguien caiga en la trampa ya!",
    author: "Fraga",
  },
  {
    id: 8,
    quote: "Tranquilos que yo controlo el GPS, en cinco minutos llegamos (spoiler: tardaron dos horas).",
    author: "Pintos",
  },
];
