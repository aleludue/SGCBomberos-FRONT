import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/shared/stores/auth.store';

const bffService = axios.create({
  baseURL: import.meta.env.VITE_BFFAPI_URL,
});

bffService.interceptors.request.use(
  (config) => {
    config.headers.Accept = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error),
);

bffService.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();

    if (!error.response || error.response.status === 401) {
      if (!router.currentRoute.value.path.includes('/auth')) {
        authStore.logout();
        router.replace({ name: 'login' });
      }
    }

    const errorMessage = error.response?.data?.message || 'Error de conexión con el servidor';

    return Promise.reject({
      ok: false,
      message: errorMessage,
    });
  },
);

export { bffService };
