import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { MenuDetail } from '@/features/account/interfaces';
import { menuAction } from '@/features/account/services';

export const useMenuStore = defineStore('menu', () => {
  const menu = ref<MenuDetail[] | undefined>(undefined);

  const setMenu = async () => {
    menu.value = undefined;

    try {
      const menuResp = await menuAction();
      menu.value = menuResp.ok ? menuResp.data : undefined;
    } catch {
      menu.value = undefined;
    }
  };

  const clearMenu = () => {
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
