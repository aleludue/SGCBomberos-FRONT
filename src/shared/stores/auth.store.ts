import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

import { type UserData } from '@/features/account/interfaces';
import { checkAuthAction, loginAction } from '@/features/login/services';
import { useMenuStore } from '@/shared/stores/menu.store';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { AuthStatus } from '@/features/login/interfaces';

export const useAuthStore = defineStore('auth', () => {
  const getStoredUser = (): UserData | undefined => {
    const data = sessionStorage.getItem('authStore');
    return data ? JSON.parse(data) : undefined;
  };

  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const user = ref<UserData | undefined>(getStoredUser());

  const menuStore = useMenuStore();
  const settingStore = useSiteConfigStore();
  const toast = useToast();

  const logout = () => {
    authStatus.value = AuthStatus.Unauthenticated;
    user.value = undefined;
    sessionStorage.clear();
    menuStore.clearMenu();
  };

  const login = async (email: string, password: string) => {
    try {
      const loginResp = await loginAction(email, password);

      if (!loginResp.ok || !loginResp.data) {
        toast.error(loginResp.message);
        logout();
        return false;
      }

      user.value = loginResp.data.user;
      authStatus.value = AuthStatus.Authenticated;

      sessionStorage.setItem('authStore', JSON.stringify(user.value));
      settingStore.setUserSettings(loginResp.data.settings);
      await menuStore.setMenu();

      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    if (!sessionStorage.getItem('authStore')) {
      logout();
      return false;
    }

    try {
      const statusResp = await checkAuthAction();
      if (!statusResp.ok) {
        logout();
        return false;
      }

      authStatus.value = AuthStatus.Authenticated;
      await menuStore.setMenu();
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const updateUserName = (fullName: string) => {
    if (user.value) {
      user.value.fullName = fullName;
      sessionStorage.setItem('authStore', JSON.stringify(user.value));
    }
  };

  return {
    // State
    user,
    authStatus,
    // Getters
    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),
    username: computed(() => user.value?.fullName),
    // Actions
    login,
    logout,
    checkAuthStatus,
    updateUserName,
  };
});
