import { sgcbApi } from '@/api/sgcbApi';
import { isAxiosError } from 'axios';
import type { AuthResponse, User } from '@/features/account/interfaces';

interface LoginResult {
  ok: boolean;
  message: string;
  user?: User;
}

export const loginAction = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const resp = await sgcbApi.get<AuthResponse>(
      `/Account/login?Email=${email}&password=${password}`,
    );

    return {
      ok: resp.data.success,
      message: resp.data.message,
      user: resp.data.data,
    };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo realizar la petición');
  }
};
