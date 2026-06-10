import { AuthStatus } from '@/features/login/interfaces/auth-status.enum';
import { logoutAction } from '@/features/login/services';
import router from '@/router';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { useAuthStore } from '@/shared/stores/auth.store';

export const siteLogout = async () => {
  const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
  const authStore = useAuthStore();

  activeSpinner('Cerrando sesión...');

  await logoutAction();
  sessionStorage.clear();
  authStore.authStatus = AuthStatus.Unauthenticated;

  await router.push({ name: 'login' });
  desactivateSpinner();
};

export const localDateToIso = (localDate: string): string => {
  if (!localDate) return '';
  const [day, month, year] = localDate.split('/');
  if (!day || !month || !year) return '';

  const d = day.padStart(2, '0');
  const m = month.padStart(2, '0');

  return `${year}-${m}-${d}`;
};

export const isoToLocalDate = (isoDate: string | Date): string => {
  if (!isoDate) return '';

  if (isoDate instanceof Date) {
    if (isNaN(isoDate.getTime())) return '';
    const day = String(isoDate.getDate()).padStart(2, '0');
    const month = String(isoDate.getMonth() + 1).padStart(2, '0');
    const year = isoDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  if (isoDate.includes('T')) {
    const cleanIso = isoDate.split('T')[0];
    const [year, month, day] = cleanIso.split('-');
    return `${day}/${month}/${year}`;
  }

  const strDate = String(isoDate);
  const [year, month, day] = strDate.split('-');
  if (!year || !month || !day) return '';

  return `${day}/${month}/${year}`;
};
