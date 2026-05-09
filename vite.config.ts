import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    vue(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: { enabled: true, type: 'module' },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,vue}'],
      },
      includeAssets: ['LogoPrincipal.png', 'LogoCuartel.png', 'favicon.ico', 'Icons/*.png'],
      manifest: {
        name: 'SGC Bomberos',
        short_name: 'SGCB',
        description: 'App web dedicada a toda la gestión interna de un cuartel de bomberos.',
        background_color: '#ffffff',
        theme_color: '#212529',
        start_url: '.',
        display: 'standalone',
        display_override: ['window-controls-overlay'],
        orientation: 'portrait',
        protocol_handlers: [
          {
            protocol: 'web+sgcbomberos',
            url: '/?url=%s',
          },
        ],
        screenshots: [
          {
            src: 'Img/Screenshot-cel.png',
            sizes: '412x915',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: 'Img/Screenshot-pc.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
        icons: [
          {
            src: 'favicon.ico',
            sizes: '32x32',
            type: 'image/x-icon',
          },
          {
            src: 'Icons/Logo-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'Icons/Logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
