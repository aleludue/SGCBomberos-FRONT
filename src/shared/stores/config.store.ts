import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ConfigStore } from '../interfaces/common-interface';

export const useSiteConfigStore = defineStore('siteConfig', () => {
  const configs = ref<ConfigStore>({
    spinnerShow: false,
    spinerText: undefined,
    siteColorMode: 'light',
  });

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
    activeSpinner,
    deactivateSpinner,
    darkMode,
    lightMode,
  };
});
