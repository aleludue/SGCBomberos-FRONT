import { AuthStatus } from '@/features/login/interfaces/auth-status.enum';
import { logoutAction } from '@/features/login/services';
import router from '@/router';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { useAuthStore } from '@/shared/stores/auth.store';
import { i18n } from '@/config/i18n';

export const siteLogout = async () => {
  const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
  const authStore = useAuthStore();

  activeSpinner(i18n.global.t('BaseViews.LogoutMessage'));

  await logoutAction();
  localStorage.clear();
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

export const bufferToBase64Url = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const base64UrlToBuffer = (base64Url: string) => {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};
