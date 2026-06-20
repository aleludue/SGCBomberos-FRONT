import type { MenuDetail, SubMenuDetail } from '@/features/account/interfaces';
import { AuthStatus } from '@/features/login/interfaces';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { useMenuStore } from '@/shared/stores/menu.store';

import {
  createRouter,
  createWebHistory,
  isNavigationFailure,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router';
import { i18n } from '@/config/i18n';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/shared/views/HomeView.vue'),
    meta: { title: 'Titles.Home', requiresAuth: true },
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/features/login/views/LoginView.vue'),
    meta: { title: 'Titles.Login', guest: true },
  },
  {
    path: '/auth/recover/:email?',
    name: 'recover',
    component: () => import('@/features/login/views/RecoverView.vue'),
    props: true,
    meta: { title: 'Titles.Recover', guest: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/features/account/views/ProfileView.vue'),
    meta: { title: 'Titles.Profile', requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/features/account/views/ConfigView.vue'),
    meta: { title: 'Titles.Settings', requiresAuth: true },
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: () => import('@/shared/views/NotFound.vue'),
    meta: { title: 'Titles.NotFound' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const updateDocumentTitle = (to: RouteLocationNormalized) => {
  const titleKey = (to.meta?.title as string) || 'SystemBase.NameShort';
  document.title = i18n.global.t(titleKey);
};

const routeRequiresAuth = (to: RouteLocationNormalized) =>
  to.matched.some((record) => !!record.meta?.requiresAuth);
const routeRequiresGuest = (to: RouteLocationNormalized) =>
  to.matched.some((record) => !!record.meta?.guest);
const attemptedDynamicRouteReloads = new Set<string>();

const createMenuRoute = (item: MenuDetail | SubMenuDetail) => ({
  path: item.route,
  name: item.name,
  props: true,
  component: () => import(`@/features/${item.feature}/views/${item.viewName}.vue`),
  meta: {
    title: 'title' in item ? item.title || item.name : item.name,
    requiresAuth: true,
  },
});

export const registerDynamicRoutes = (menu: MenuDetail[]) => {
  const register = (item: MenuDetail | SubMenuDetail) => {
    if (!router.hasRoute(item.name)) {
      router.addRoute(createMenuRoute(item));
    }
  };

  menu.forEach((routeInfo) => {
    register(routeInfo);
    routeInfo.subMenu?.forEach(register);
  });
};

router.beforeEach(async (to) => {
  const { activeSpinner } = useSiteConfigStore();
  const authStore = useAuthStore();
  const menuStore = useMenuStore();

  activeSpinner(i18n.global.t('Messages.LoadView'));
  updateDocumentTitle(to);

  if (authStore.authStatus === AuthStatus.Checking) {
    await authStore.checkAuthStatus();
  }

  if (authStore.authStatus === AuthStatus.Authenticated && menuStore.menu?.length) {
    if (!to.matched.length && !attemptedDynamicRouteReloads.has(to.fullPath)) {
      registerDynamicRoutes(menuStore.menu);
      attemptedDynamicRouteReloads.add(to.fullPath);
      return { path: to.fullPath, query: to.query, hash: to.hash, replace: true };
    }
  }

  if (routeRequiresAuth(to) && authStore.authStatus === AuthStatus.Unauthenticated) {
    return { name: 'login' };
  }

  if (routeRequiresGuest(to) && authStore.authStatus === AuthStatus.Authenticated) {
    return { name: 'home' };
  }

  if (!to.matched.length) {
    if (authStore.authStatus !== AuthStatus.Authenticated) {
      return { name: 'login' };
    }
    return { name: 'not-found' };
  }

  return true;
});

router.afterEach((to, from, failure) => {
  if (isNavigationFailure(failure)) {
    const { desactivateSpinner } = useSiteConfigStore();
    desactivateSpinner();
  }
});

router.onError(() => {
  const { desactivateSpinner } = useSiteConfigStore();
  desactivateSpinner();
});

export default router;
