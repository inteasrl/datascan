import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: './',
  build: {
    minify: 'terser', 
    target: 'esnext', 
    terserOptions: {
      compress: {
        drop_console: true, 
        drop_debugger: true, 
      },
    },
    rollupOptions: {
      input: {
        main: 'index.html',
        dati: 'dati.html',
        prnn: 'pnrr.html',
        privacy: 'privacy.html'
      }
    }
  }
});
