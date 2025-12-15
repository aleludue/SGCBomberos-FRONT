import { bffService } from '@/api/bffService';
import { isAxiosError } from 'axios';

interface CheckResponse {
  ok: boolean;
}

export const checkAuthAction = async (): Promise<CheckResponse> => {
  try {
    await bffService.get('/account/checkLogin');

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
    await bffService.get('/Health/AppState');

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
