import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { configYupMsg } from '@/config/yup';
import { useSiteConfigStore } from '@/shared/stores/config.store';

type ThemeMode = 'light' | 'dark' | 'default';

export function useAppSettings() {
  const configStore = useSiteConfigStore();
  const { locale, t } = useI18n();

  const applyThemeMode = (mode: ThemeMode) => {
    let targetMode: ThemeMode = mode;

    if (mode === 'default') {
      targetMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-bs-theme', targetMode);
  };

  watch(
    () => configStore.configs.siteColorMode,
    (newMode) => {
      applyThemeMode(newMode as ThemeMode);
    },
    { immediate: true },
  );

  watch(
    () => configStore.configs.siteLanguage,
    (newLang) => {
      locale.value = newLang;
      configYupMsg(t);
    },
    { immediate: true },
  );
}
