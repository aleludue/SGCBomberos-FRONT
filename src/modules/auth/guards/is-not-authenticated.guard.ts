import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { AuthStatus } from '../interfaces';

const isNotAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  // Solo verificar si está en estado "Checking"
  if (authStore.authStatus === AuthStatus.Checking) {
    await authStore.checkAuthStatus();
  }

  // Si está autenticado, redirigir a home
  if (authStore.authStatus === AuthStatus.Authenticated) {
    next({ name: 'home' });
  } else {
    // Si NO está autenticado, permitir acceso
    next();
  }
};

export default isNotAuthenticatedGuard;
