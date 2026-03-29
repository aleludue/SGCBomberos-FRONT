import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

import { type UserData } from '@/features/account/interfaces';
import { checkAuthAction, loginAction } from '@/features/login/services';
import { useMenuStore } from '@/shared/stores/menu.store';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { AuthStatus } from '@/features/login/interfaces';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const user = ref<UserData | undefined>(
    sessionStorage.getItem('authStore') != null
      ? JSON.parse(sessionStorage.getItem('authStore') as string)
      : undefined,
  );

  const menuStore = useMenuStore();
  const settingStore = useSiteConfigStore();
  const toast = useToast();

  const login = async (email: string, password: string) => {
    try {
      const loginResp = await loginAction(email, password);

      if (!loginResp.ok || !loginResp.data) {
        toast.error(loginResp.message);
        logout();
        return false;
      }

      user.value = loginResp.data.user;
      sessionStorage.setItem('authStore', JSON.stringify(user.value));
      authStatus.value = AuthStatus.Authenticated;

      settingStore.setUserSettings(loginResp.data.settings);
      menuStore.setMenu();

      return true;
    } catch (error) {
      return logout();
    }
  };

  const logout = () => {
    authStatus.value = AuthStatus.Unauthenticated;
    user.value = undefined;
    sessionStorage.clear();
  };

  const checkAuthStatus = async (): Promise<boolean> => {
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
