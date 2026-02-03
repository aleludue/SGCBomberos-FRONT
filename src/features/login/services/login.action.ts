import { bffService } from '@/api/bffService';
import { isAxiosError } from 'axios';
import type { AuthResponse } from '@/features/login/interfaces';
import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import type { UserDetail } from '@/features/account/interfaces';

interface LoginResult {
  ok: boolean;
  message: string;
  data?: UserDetail;
}

interface CheckResponse {
  ok: boolean;
}

export const loginAction = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const resp = await bffService.get<AuthResponse>(
      `/account/login?Email=${email}&password=${password}`,
    );

    return {
      ok: resp.data.success,
      message: resp.data.message,
      data: resp.data.data,
    };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo iniciar la sesión.');
  }
};

export const logoutAction = async (): Promise<boolean> => {
  try {
    const resp = await bffService.get<ApiBaseResponse>('/account/logout');
    return resp.data.success;
  } catch (error) {
    if (isAxiosError(error)) {
      return false;
    }

    throw new Error('No se pudo cerrar la sesión.');
  }
};

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
