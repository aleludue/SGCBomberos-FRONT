import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { MenuDetail } from '@/features/account/interfaces';
import { menuAction } from '@/features/account/services';

export const useMenuStore = defineStore('menu', () => {
  const menu = ref<MenuDetail[] | undefined>(undefined);

  const setMenu = async () => {
    const menuResp = await menuAction();

    if (menuResp.ok) {
      menu.value = menuResp.data;
    }
  };

  const clearMenu = async () => {
    menu.value = undefined;
  };

  return {
    menu,
    // Getters

    // Actions
    setMenu,
    clearMenu,
  };
});
