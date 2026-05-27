import axios from 'axios';
import { i18n } from '@/config/i18n';

import router from '@/router';
import { useAuthStore } from '@/shared/stores/auth.store';
import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

const bffService = axios.create({
  baseURL: import.meta.env.VITE_BFFAPI_URL,
  timeout: Number(import.meta.env.VITE_BFFAPI_TIMEOUT) || 60000,
});

const t = i18n.global.t;

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
  (response) => {
    if (response.status === 204) {
      response.data = {
        success: true,
        message: '',
        data: null,
      } as ApiBaseResponse;

      const methType = response.config.method?.toLowerCase();

      if (methType === 'post') {
        response.data.message = t('Messages.SuccessCreate');
      } else if (methType === 'put') {
        response.data.message = t('Messages.SuccessUpdate');
      } else if (methType === 'delete') {
        response.data.message = t('Messages.SuccessDelete');
      }
    }

    return response;
  },
  (error) => {
    const authStore = useAuthStore();

    if (!error.response || error.response.status === 401) {
      if (!router.currentRoute.value.path.includes('/auth')) {
        authStore.logout();
        router.replace({ name: 'login' });
      }
    }

    const errorMessage = error.response?.data?.message || 'Error de conexión con el servidor';

    error.data = {
      success: false,
      message: errorMessage,
      data: null,
    } as ApiBaseResponse;

    return Promise.resolve(error);
  },
);

export { bffService };
