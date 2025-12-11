import { sgcbApi } from '@/api/sgcbApi';
import { isAxiosError } from 'axios';

interface CheckResponse {
  ok: boolean;
}

export const checkAuthAction = async (): Promise<CheckResponse> => {
  try {
    await sgcbApi.get('/Account/CheckLogin');

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
    await sgcbApi.get('/Health/AppState');

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
