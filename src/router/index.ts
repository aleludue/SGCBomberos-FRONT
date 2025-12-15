import { AuthStatus } from '@/features/account/interfaces';
import { useAuthStore } from '@/features/account/stores/auth.store';
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
      path: '/auth',
      name: 'auth',
      redirect: { name: 'login' },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/features/account/views/LoginView.vue'),
        },
      ],
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
  }

  if (!to.path.includes('/auth') && authStore.authStatus === AuthStatus.Unauthenticated) {
    router.replace({ name: 'login' });
  }

  if (to.path.includes('/auth') && authStore.authStatus === AuthStatus.Authenticated) {
    router.replace({ name: 'home' });
  }

  if (to.matched.length === 0) {
    router.replace({ name: 'not-found' });
  }

  next();
});

export default router;
