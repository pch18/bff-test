import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import bffLoaderVitePlugin from '@bff-sdk/web/bffLoaderVitePlugin'

import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspect(),
    react(),
    bffLoaderVitePlugin({ serverUrl: 'http://localhost:7016' })
  ],

})
