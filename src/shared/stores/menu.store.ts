import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { MenuDetail } from '@/features/account/interfaces';
import { menuAction } from '@/features/account/services';

export const useMenuStore = defineStore('menu', () => {
  const menu = ref<MenuDetail[] | undefined>(undefined);

  const setMenu = async () => {
    try {
      const menuResp = await menuAction();
      if (menuResp.ok) {
        menu.value = menuResp.data;
      }
    } catch (error) {
      menu.value = undefined;
    }
  };

  const clearMenu = async () => {
    menu.value = undefined;
  };

  const isMenuLoaded = computed(() => menu.value !== undefined && menu.value.length > 0);

  return {
    // State
    menu,
    // Getters
    isMenuLoaded,
    // Actions
    setMenu,
    clearMenu,
  };
});
