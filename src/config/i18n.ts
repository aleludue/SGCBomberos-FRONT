import { createI18n } from 'vue-i18n';
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
