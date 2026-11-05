import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages: https://dmsthd0110.github.io/our-fridge/
export default defineConfig({
  base: '/our-fridge/',
  plugins: [react(), tailwindcss()],
})
