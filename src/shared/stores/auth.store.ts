import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, type UserData } from '@/features/account/interfaces';
import { checkAuthAction, loginAction } from '@/features/account/services';
import { useMenuStore } from '@/shared/stores/menu.store';
import { useSiteConfigStore } from '@/shared/stores/config.store';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const user = ref<UserData | undefined>(
    sessionStorage.getItem('authStore') != null
      ? JSON.parse(sessionStorage.getItem('authStore') as string)
      : undefined,
  );

  const menuStore = useMenuStore();
  const settingStore = useSiteConfigStore();

  const login = async (email: string, password: string) => {
    try {
      const loginResp = await loginAction(email, password);

      if (!loginResp.ok || !loginResp.data) {
        logout();
        return false;
      }

      user.value = loginResp.data.user;
      authStatus.value = AuthStatus.Authenticated;
      sessionStorage.setItem('authStore', JSON.stringify(user.value));

      await settingStore.setUserSettings(loginResp.data.settings);
      await menuStore.setMenu();

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
  };
});
