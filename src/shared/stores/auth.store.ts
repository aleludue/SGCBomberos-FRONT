import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

import { type UserData, type UserDetail } from '@/features/account/interfaces';
import { checkAuthAction, loginAction, postFingerLogVerify } from '@/features/login/services';
import { useMenuStore } from '@/shared/stores/menu.store';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { AuthStatus, type FingerLogVerifyCommand } from '@/features/login/interfaces';

export const useAuthStore = defineStore('auth', () => {
  const getStoredUser = (): UserData | undefined => {
    const data = localStorage.getItem('authStore');
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
    localStorage.clear();
    menuStore.clearMenu();
  };

  const login = async (email: string, password: string) => {
    try {
      const { ok, data, message } = await loginAction(email, password);

      if (!ok || !data) {
        toast.error(message);
        logout();
        return false;
      }

      await loginProcess(data);
      return true;
    } catch {
      logout();
      return false;
    }
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    if (!localStorage.getItem('authStore')) {
      logout();
      return false;
    }

    try {
      const { ok, data } = await checkAuthAction();
      if (!ok || !data) {
        logout();
        return false;
      }

      await loginProcess(data);
      return true;
    } catch {
      logout();
      return false;
    }
  };

  const updateUserName = (fullName: string) => {
    if (user.value) {
      user.value.fullName = fullName;
      localStorage.setItem('authStore', JSON.stringify(user.value));
    }
  };

  const loginFinger = async (commandVerify: FingerLogVerifyCommand) => {
    try {
      const { ok, data, message } = await postFingerLogVerify(commandVerify);

      if (!ok || !data) {
        toast.error(message);
        logout();
        return false;
      }

      await loginProcess(data);
      return true;
    } catch {
      logout();
      return false;
    }
  };

  const loginProcess = async (data: UserDetail) => {
    user.value = data.user;
    authStatus.value = AuthStatus.Authenticated;

    localStorage.setItem('authStore', JSON.stringify(user.value));
    settingStore.setUserSettings(data.settings);
    await menuStore.setMenu();
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
    loginFinger,
  };
});
