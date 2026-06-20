import { bffService } from '@/api/bffService';
import type {
  AuthResponse,
  FingerLogOptions,
  FingerLogOptionsResponse,
  FingerLogVerifyCommand,
} from '@/features/login/interfaces';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type { UserDetail } from '@/features/account/interfaces';
import { i18n } from '@/config/i18n';

const t = i18n.global.t;

export const loginAction = async (
  email: string,
  password: string,
): Promise<GenericActionResponse<UserDetail>> => {
  const { data } = await bffService.post<AuthResponse>('/account/login', {
    email,
    password,
  });

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
    message: data.success ? t('Messages.SuccessLogout') : data.message,
    data: data.data,
  };
};

export const checkAuthAction = async (): Promise<GenericActionResponse<UserDetail>> => {
  const { data } = await bffService.get<AuthResponse>('/account/checkLogin');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const postFingerLogOptions = async (): Promise<GenericActionResponse<FingerLogOptions>> => {
  const { data } = await bffService.post<FingerLogOptionsResponse>(
    '/account/fingerprint/login-options',
  );

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const postFingerLogVerify = async (
  commandVerify: FingerLogVerifyCommand,
): Promise<GenericActionResponse<UserDetail>> => {
  const { data } = await bffService.post<AuthResponse>(
    '/account/fingerprint/login-verify',
    commandVerify,
  );

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
