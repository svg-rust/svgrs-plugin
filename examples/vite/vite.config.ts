import path from 'node:path'

import react from '@vitejs/plugin-react'
import { svgrs } from 'svgrs-plugin/vite'
import { defineConfig } from 'vite'
import { VitePluginDocument } from 'vite-plugin-document'
import inspect from 'vite-plugin-inspect'
import pages from 'vite-plugin-pages'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgrs(),
    pages(),
    VitePluginDocument(),
    !!process.env.VITE_INSPECT && inspect(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
