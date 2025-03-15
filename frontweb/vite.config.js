<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Puerto de desarrollo
    open: true, // Abre el navegador automáticamente
  },
});
>>>>>>> 3dd0c1235b06a864ae24886e66ecb7007e197783
