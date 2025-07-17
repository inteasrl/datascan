import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
  plugins: [tailwindcss()],
  base: 'https://github.com/inteasrl/datascan',
   build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        dati:'dati.html',
      }
    }
  }
});