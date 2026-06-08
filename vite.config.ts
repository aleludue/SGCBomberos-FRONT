import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const basePath = (env.VITE_APP_BASE || '/').replace(/\\/g, '/');
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`;

  return {
    base,
    plugins: [
      vue(),
      mkcert(),
      VitePWA({
        registerType: 'prompt',
        injectRegister: 'auto',
        devOptions: {
          enabled: false,
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}'],
          maximumFileSizeToCacheInBytes: 5242880,
          skipWaiting: true,
          clientsClaim: true,
          navigateFallback: `${base}index.html`,
        },
        includeAssets: ['favicon.ico', 'Icons/*.png'],
        manifest: {
          name: 'SGC Bomberos',
          short_name: 'SGCB',
          description: 'App web dedicada a toda la gestión interna de un cuartel de bomberos.',
          background_color: '#212529',
          theme_color: '#212529',
          start_url: base,
          scope: base,
          display: 'standalone',
          display_override: ['window-controls-overlay'],
          orientation: 'portrait',
          protocol_handlers: [
            {
              protocol: 'web+sgcbomberos',
              url: `${base}?url=%s`,
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
              purpose: 'any maskable',
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
  };
});
