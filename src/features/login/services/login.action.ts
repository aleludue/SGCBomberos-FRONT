import { bffService } from '@/api/bffService';
import type { AuthResponse } from '@/features/login/interfaces';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type { UserDetail } from '@/features/account/interfaces';

export const loginAction = async (
  email: string,
  password: string,
): Promise<GenericActionResponse<UserDetail>> => {
  const { data } = await bffService.get<AuthResponse>(
    `/account/login?Email=${email}&password=${password}`,
  );

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const logoutAction = async (): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.get('/account/logout');
  return {
    ok: data.success,
    message: data.success ? 'Sesión cerrada correctamente' : data.message,
    data: data.data,
  };
};

export const checkAuthAction = async (): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.get('/account/checkLogin');

  return {
    ok: data.success,
    message: data.success ? 'Sesión activa' : data.message,
    data: data.data,
  };
};
