import { logoutAction } from '@/features/account/services/logout.action';
import { useSiteConfigStore } from '@/shared/stores/config.store';

export const siteLogout = async () => {
  const settingStore = useSiteConfigStore();
  settingStore.activeSpinner('Cerrando sesión...');
  await logoutAction();
  sessionStorage.clear();
  window.location.href = '/auth/login';
  settingStore.deactivateSpinner();
};

export const isMobile = () => {
  return window.innerWidth <= 768;
};
