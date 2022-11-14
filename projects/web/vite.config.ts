import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import bffPlugin from './bff/plugin'
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspect(),
    react(),
    bffPlugin({ serverUrl: 'http://localhost:3000' })
  ],

})
