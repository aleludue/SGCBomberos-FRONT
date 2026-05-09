import { createApp } from 'vue';
import { createPinia } from 'pinia';

import languageEs from '@/assets/text-es.json';
import languageEn from '@/assets/text-en.json';
import { createI18n } from 'vue-i18n';

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

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from '@/App.vue';
import router from '@/router';

import '@/assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast);
app.use(i18n);

app.mount('#app');
