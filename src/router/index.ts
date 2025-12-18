import { AuthStatus } from '@/features/account/interfaces';
import { useAuthStore } from '@/features/account/stores/auth.store';
import { useMenuStore } from '@/features/account/stores/menu.store';
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
      path: '/profile',
      name: 'profile',
      component: () => import('@/features/account/views/ProfileView.vue'),
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

    const menuStore = useMenuStore();
    menuStore.menu?.forEach((x) => {
      router.addRoute({
        path: x.route,
        name: x.name,
        props: true,
        component: () => import(`@/features/${x.feature}/views/${x.viewName}.vue`),
      });
    });

    router.replace(to.path);
  }

  if (!to.path.includes('/auth') && authStore.authStatus === AuthStatus.Unauthenticated) {
    router.replace({ name: 'login' });
  }

  if (to.path.includes('/auth') && authStore.authStatus === AuthStatus.Authenticated) {
    router.replace({ name: 'home' });
  }

  if (!router.getRoutes().some((r) => r.path === to.path)) {
    router.replace({ name: 'not-found' });
  }

  next();
});

export default router;
