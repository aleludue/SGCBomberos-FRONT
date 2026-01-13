import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['LogoPrincipal.png', 'LogoCuartel.png'],
      manifest: {
        name: 'SGCB PWA',
        short_name: 'SGCBApp',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'LogoPrincipal.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'LogoPrincipal.png',
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
});
