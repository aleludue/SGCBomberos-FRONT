import { bffService } from '@/api/bffService';
import type { AuthResponse } from '@/features/login/interfaces';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type { UserDetail } from '@/features/account/interfaces';

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
  } catch (error: any) {
    return error;
  }
};

export const logoutAction = async (): Promise<GenericActionResponse<null>> => {
  try {
    await bffService.get('/account/logout');
    return {
      ok: true,
      message: 'Sesión cerrada correctamente',
    };
  } catch (error: any) {
    return error;
  }
};

export const checkAuthAction = async (): Promise<GenericActionResponse<null>> => {
  try {
    await bffService.get('/account/checkLogin');

    return {
      ok: true,
      message: 'Sesión activa',
    };
  } catch (error: any) {
    return error;
  }
};
