import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, type User } from '../interfaces';
import { checkAuthAction, loginAction } from '../actions';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const user = ref<User | undefined>(
    sessionStorage.getItem('authStore')
      ? JSON.parse(sessionStorage.getItem('authStore') as string)
      : undefined,
  );

  const login = async (email: string, password: string) => {
    try {
      const loginResp = await loginAction(email, password);
      if (!loginResp.ok) {
        logout();
        return false;
      }

      user.value = loginResp.user;
      authStatus.value = AuthStatus.Authenticated;

      sessionStorage.setItem('authStore', user.value!.toString());
      sessionStorage.setItem('authStatus', authStatus.value.toString());
      return true;
    } catch (error) {
      return logout();
    }
  };

  const logout = () => {
    authStatus.value = AuthStatus.Unauthenticated;
    sessionStorage.setItem('authStatus', authStatus.value.toString());
    user.value = undefined;
    sessionStorage.removeItem('authStore');
    return false;
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResp = await checkAuthAction();

      if (!statusResp.ok) {
        logout();
        return false;
      }

      authStatus.value = AuthStatus.Authenticated;
      sessionStorage.setItem('authStatus', authStatus.value.toString());
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
