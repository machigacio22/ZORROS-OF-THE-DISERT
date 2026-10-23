/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        desert: {
          bg: "#121212",       // Carbón oscuro
          card: "#1E1A17",     // Arena nocturna
          fox: "#EA580C",      // Naranja zorro intenso
          gold: "#D97706",     // Dorado desierto
          bone: "#F5F5F4",     // Blanco hueso (calaveras y texto)
          muted: "#A8A29E",    // Gris piedra
        },
      },
    },
  },
  plugins: [],
};
