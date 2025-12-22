import { logoutAction } from '@/features/account/services/logout.action';

export const siteLogout = async () => {
  await logoutAction();
  sessionStorage.clear();
  window.location.href = '/auth/login';
};

export const isMobile = () => {
  return window.innerWidth <= 768;
};
