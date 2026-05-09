import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import Toast from 'vue-toastification';

import 'vue-toastification/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/assets/main.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import languageEs from '@/assets/text-es.json';
import languageEn from '@/assets/text-en.json';

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'es',
  fallbackLocale: 'en',
  messages: {
    es: languageEs,
    en: languageEn,
  },
});

import App from '@/App.vue';
import router from '@/router';

const app = createApp(App);

app.use(createPinia());
app.use(i18n);
app.use(router);
app.use(Toast);

app.mount('#app');
