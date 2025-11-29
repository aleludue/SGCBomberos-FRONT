import { sgcbApi } from '@/api/sgcbApi';
import { isAxiosError } from 'axios';

interface CheckResponse {
  ok: boolean;
}

export const checkAuthAction = async (): Promise<CheckResponse> => {
  try {
    await sgcbApi.get('/Account/CheckLogin', { withCredentials: true });

    return {
      ok: true,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        ok: false,
      };
    }

    throw new Error('No se pudo verificar la sesión');
  }
};

export const checkAppState = async (): Promise<CheckResponse> => {
  try {
    debugger;
    await sgcbApi.get('/Health/AppState', { withCredentials: true });

    return {
      ok: true,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        ok: false,
      };
    }

    throw new Error('No se pudo verificar la sesión');
  }
};
