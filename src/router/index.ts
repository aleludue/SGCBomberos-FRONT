import { AuthStatus } from '@/features/login/interfaces';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { createRouter, createWebHistory } from 'vue-router';
import { i18n } from '@/config/i18n';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home-layout',
      component: () => import('@/shared/views/HomeView.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/shared/views/HomeView.vue'),
          meta: { title: 'Titles.Home' },
        },
      ],
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/features/login/views/LoginView.vue'),
      meta: { title: 'Titles.Login' },
    },
    {
      path: '/auth/recover/:email?',
      name: 'recover',
      component: () => import('@/features/login/views/RecoverView.vue'),
      props: true,
      meta: { title: 'Titles.Recover' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/features/account/views/ProfileView.vue'),
      meta: { title: 'Titles.Profile' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/features/account/views/ConfigView.vue'),
      meta: { title: 'Titles.Settings' },
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('@/shared/views/NotFound.vue'),
      meta: { title: 'Titles.NotFound' },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const { activeSpinner } = useSiteConfigStore();
  const authStore = useAuthStore();

  activeSpinner();

  const titleKey = (to.meta.title as string) || 'SystemBase.NameShort';
  document.title = i18n.global.t(titleKey);

  if (authStore.authStatus === AuthStatus.Checking) {
    await authStore.checkAuthStatus();
    return next(to.fullPath);
  }

  if (!to.path.includes('/auth') && authStore.authStatus === AuthStatus.Unauthenticated) {
    return next({ name: 'login' });
  }

  if (to.path.includes('/auth') && authStore.authStatus === AuthStatus.Authenticated) {
    return next({ name: 'home' });
  }

  if (to.matched.length === 0) {
    return next({ name: 'not-found' });
  }

  next();
});

router.afterEach(() => {
  const { deactivateSpinner } = useSiteConfigStore();
  deactivateSpinner();
});

router.onError(() => {
  const { deactivateSpinner } = useSiteConfigStore();
  deactivateSpinner();
});

export default router;
