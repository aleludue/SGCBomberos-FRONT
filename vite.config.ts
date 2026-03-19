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
      devOptions: { enabled: true },
      includeAssets: [
        'LogoPrincipal.png',
        'LogoCuartel.png',
        'favicon.ico',
        'Icons/Logo-144.png',
        'Icons/Logo-180.png',
        'Icons/Logo-192.png',
        'Icons/Logo-384.png',
        'Icons/Logo-512.png',
      ],
      manifest: {
        name: 'SGC Bomberos',
        short_name: 'SGCB',
        description: 'App web dedicada a toda la gestión interna de un cuartel de bomberos.',
        background_color: '#ffffff',
        theme_color: '#42b983',
        start_url: '/',
        display: 'fullscreen',
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
            src: 'Icons/Logo-144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'Icons/Logo-180.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: 'Icons/Logo-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'Icons/Logo-384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'Icons/Logo-512.png',
            sizes: '512x512',
            type: 'image/png',
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
  build: {
    outDir: 'dist',
    manifest: 'manifest.json',
  },
  server: {
    port: 3000,
    host: 'localhost',
  },
});
