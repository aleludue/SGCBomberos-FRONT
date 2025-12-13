import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { MenuDetail } from '@/features/account/interfaces/menu.interface';
import { menuAction } from '@/features/account/services/menu.action';

export const useMenuStore = defineStore('menu', () => {
  const menu = ref<MenuDetail[] | undefined>(
    sessionStorage.getItem('menuStore') != null
      ? JSON.parse(sessionStorage.getItem('menuStore') as string)
      : undefined,
  );

  const setMenu = async () => {
    const menuResp = await menuAction();

    if (menuResp.ok) {
      menu.value = menuResp.data;
      sessionStorage.setItem('menuStore', JSON.stringify(menuResp.data));
    }
  };

  const clearMenu = async () => {
    menu.value = undefined;
    sessionStorage.removeItem('menuStore');
  };

  return {
    menu,
    // Getters

    // Actions
    setMenu,
    clearMenu,
  };
});
