import { AuthStatus } from '@/features/login/interfaces';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { createRouter, createWebHistory } from 'vue-router';
import { i18n } from '@/main';

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
          meta: { title: 'HomeView.ViewTitle' },
        },
      ],
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/features/login/views/LoginView.vue'),
      meta: { title: 'LoginView.ViewTitle' },
    },
    {
      path: '/auth/recover/:email?',
      name: 'recover',
      component: () => import('@/features/login/views/RecoverView.vue'),
      props: true,
      meta: { title: 'RecoverView.ViewTitle' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/features/account/views/ProfileView.vue'),
      meta: { title: 'ProfileView.ViewTitle' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/features/account/views/ConfigView.vue'),
      meta: { title: 'ConfigView.ViewTitle' },
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('@/shared/views/NotFound.vue'),
      meta: { title: 'NotFoundView.ViewTitle' },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const configStore = useSiteConfigStore();
  const authStore = useAuthStore();

  configStore.activeSpinner();

  const titleKey = (to.meta.title as string) || 'GenericTexts.SistemNameShort';
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

export default router;
