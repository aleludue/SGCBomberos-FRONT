import { useAuthStore } from '@/features/account/stores/auth.store';
import router from '@/router';
import axios from 'axios';

const sgcbApi = axios.create({
  baseURL: import.meta.env.VITE_TESLO_API_URL,
});

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
