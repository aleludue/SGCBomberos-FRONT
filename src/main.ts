import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import '@/config/yup';

import App from '@/App.vue';
import router from '@/router';

import '@/assets/main.css';

import languageEs from '@/assets/text-es.json';
import languageEn from '@/assets/text-en.json';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  locale: 'es',
  fallbackLocale: 'en',
  messages: {
    es: languageEs,
    en: languageEn,
  },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin);
app.use(Toast);
app.use(i18n);

app.mount('#app');
