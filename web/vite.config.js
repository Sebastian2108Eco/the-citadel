import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './' // Esto le dice que la raíz es la carpeta actual (web)
})