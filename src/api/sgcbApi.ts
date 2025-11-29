import { useAuthStore } from '@/features/account/stores/auth.store';
import router from '@/router';
import axios from 'axios';

const sgcbApi = axios.create({
  baseURL: import.meta.env.VITE_TESLO_API_URL,
});

sgcbApi.interceptors.request.use(
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

sgcbApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      const authStore = useAuthStore();
      authStore.logout();
      router.push('/auth/login');
    }

    return Promise.reject(error);
  },
);

export { sgcbApi };
