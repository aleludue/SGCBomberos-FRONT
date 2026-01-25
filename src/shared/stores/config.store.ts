import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ConfigStore } from '@/shared/interfaces/common-interface';
import type { UserSettings } from '@/features/account/interfaces';

export const useSiteConfigStore = defineStore('siteConfig', () => {
  const configs = ref<ConfigStore>({
    spinnerShow: false,
    spinerText: undefined,
    siteColorMode:
      localStorage.getItem('configStore') != null
        ? JSON.parse(localStorage.getItem('configStore') as string).siteColorMode
        : 'light',
    siteLanguage:
      localStorage.getItem('configStore') != null
        ? JSON.parse(localStorage.getItem('configStore') as string).siteLanguage
        : 'es',
  });

  const setUserSettings = async (newConfigs: UserSettings) => {
    if (newConfigs.siteColorMode != configs.value.siteColorMode) {
      configs.value.siteColorMode = newConfigs.siteColorMode;
    }

    if (newConfigs.siteLanguage != configs.value.siteLanguage) {
      configs.value.siteLanguage = newConfigs.siteLanguage;
    }

    localStorage.setItem('configStore', JSON.stringify(configs.value));
  };

  const activeSpinner = (text?: string) => {
    configs.value.spinnerShow = true;
    configs.value.spinerText = text;
  };

  const deactivateSpinner = () => {
    configs.value.spinnerShow = false;
  };

  const darkMode = () => {
    configs.value.siteColorMode = 'dark';
  };

  const lightMode = () => {
    configs.value.siteColorMode = 'light';
  };

  return {
    configs,
    // Getters

    // Actions
    setUserSettings,
    activeSpinner,
    deactivateSpinner,
    darkMode,
    lightMode,
  };
});
