import { AuthStatus } from '@/features/account/interfaces';
import { useAuthStore } from '@/shared/stores/auth.store';
import { createRouter, createWebHistory } from 'vue-router';

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
        },
      ],
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/features/login/views/LoginView.vue'),
    },
    {
      path: '/auth/recover/:email?',
      name: 'recover',
      component: () => import('@/features/login/views/RecoverView.vue'),
      props: true,
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/features/account/views/ProfileView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/shared/views/ConfigView.vue'),
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('@/shared/views/NotFound.vue'),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (authStore.authStatus === AuthStatus.Checking) {
    await authStore.checkAuthStatus();
    router.replace(to.path);
  }

  if (!to.path.includes('/auth') && authStore.authStatus === AuthStatus.Unauthenticated) {
    router.replace({ name: 'login' });
  }

  if (to.path.includes('/auth') && authStore.authStatus === AuthStatus.Authenticated) {
    router.replace({ name: 'home' });
  }

  if (router.resolve(to).matched.length === 0) {
    router.replace({ name: 'not-found' });
  }

  next();
});

export default router;
