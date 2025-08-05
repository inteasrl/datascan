import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
  plugins: [tailwindcss()],
  base: '/datascan/',
   build: {
    rollupOptions: {
      input: { 
        main: 'index.html',
        dati:'dati.html',
        privacy: 'privacy.html'
      }
    }
  }
});