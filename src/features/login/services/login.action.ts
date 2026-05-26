import { bffService } from '@/api/bffService';
import type { AuthResponse } from '@/features/login/interfaces';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type { UserDetail } from '@/features/account/interfaces';
import axios from 'axios';

export const loginAction = async (
  email: string,
  password: string,
): Promise<GenericActionResponse<UserDetail>> => {
  try {
    const { data } = await bffService.get<AuthResponse>(
      `/account/login?Email=${email}&password=${password}`,
    );

    return {
      ok: data.success,
      message: data.message,
      data: data.data,
    };
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : 'Error desconocido';

    return { ok: false, message };
  }
};

export const logoutAction = async (): Promise<GenericActionResponse<null>> => {
  try {
    await bffService.get('/account/logout');
    return {
      ok: true,
      message: 'Sesión cerrada correctamente',
    };
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : 'Error desconocido';

    return { ok: false, message };
  }
};

export const checkAuthAction = async (): Promise<GenericActionResponse<null>> => {
  try {
    await bffService.get('/account/checkLogin');

    return {
      ok: true,
      message: 'Sesión activa',
    };
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : 'Error desconocido';

    return { ok: false, message };
  }
};
