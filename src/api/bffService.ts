import { useAuthStore } from '@/features/account/stores/auth.store';
import router from '@/router';
import axios from 'axios';

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
  (error) => {
    return Promise.reject(error);
  },
);

bffService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    if (error.response === undefined || (error.response && error.response.status === 401)) {
      originalRequest._retry = true;

      const authStore = useAuthStore();
      authStore.logout();

      router.replace('/auth/login');
    }

    return Promise.reject(error);
  },
);

export { bffService };
