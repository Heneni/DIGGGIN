import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gui: ['dat.gui'],
          stats: ['stats.js']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "./src/styles/variables.less";'
      }
    }
  }
});