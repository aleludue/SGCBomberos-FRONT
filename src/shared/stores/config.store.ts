import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ConfigStore } from '@/shared/interfaces/common-interface';
import type { UserSettings } from '@/features/account/interfaces';

export const useSiteConfigStore = defineStore('siteConfig', () => {
  const getInitialConfig = (): Partial<ConfigStore> => {
    const stored = localStorage.getItem('configStore');
    return stored ? JSON.parse(stored) : {};
  };

  const savedConfigs = getInitialConfig();

  const configs = ref<ConfigStore>({
    spinnerShow: false,
    spinerText: undefined,
    siteColorMode: savedConfigs.siteColorMode || 'default',
    siteLanguage: savedConfigs.siteLanguage || 'es',
  });

  const saveToStorage = () => {
    localStorage.setItem(
      'configStore',
      JSON.stringify({
        siteColorMode: configs.value.siteColorMode,
        siteLanguage: configs.value.siteLanguage,
      }),
    );
  };

  const setUserSettings = (newConfigs: UserSettings) => {
    configs.value.siteColorMode = newConfigs.siteColorMode;
    configs.value.siteLanguage = newConfigs.siteLanguage;
    saveToStorage();
  };

  const activeSpinner = (text?: string) => {
    configs.value.spinnerShow = true;
    configs.value.spinerText = text;
  };

  const desactivateSpinner = () => {
    configs.value.spinnerShow = false;
    configs.value.spinerText = undefined;
  };

  const setMode = (mode: 'light' | 'dark' | 'default') => {
    configs.value.siteColorMode = mode;
    saveToStorage();
  };

  return {
    // State
    configs,
    // Actions
    setUserSettings,
    activeSpinner,
    desactivateSpinner,
    setMode,
    darkMode: () => setMode('dark'),
    lightMode: () => setMode('light'),
  };
});
