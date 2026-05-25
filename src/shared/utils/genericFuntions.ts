import { logoutAction } from '@/features/login/services';
import router from '@/router';
import { useSiteConfigStore } from '@/shared/stores/config.store';

export const siteLogout = async () => {
  const settingStore = useSiteConfigStore();
  settingStore.activeSpinner('Cerrando sesión...');
  await logoutAction();
  sessionStorage.clear();
  await router.push('/auth/login');
  settingStore.deactivateSpinner();
};

export const localDateToIso = (localDate: string): string => {
  if (!localDate) return '';
  const [day, month, year] = localDate.split('/');
  if (!day || !month || !year) return '';

  const parsed = new Date(`${month}/${day}/${year}`);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
};

export const isoToLocalDate = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return '';

  return `${day}/${month}/${year}`;
};
