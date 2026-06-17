import { bffService } from '@/api/bffService';
import type {
  UserSettings,
  SettingsResponse,
  FingerRegOptionsResponse,
  FingerRegOptions,
  FingerRegVerifyCommand,
} from '@/features/account/interfaces';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';

export const getSettingAction = async (): Promise<GenericActionResponse<UserSettings>> => {
  const { data } = await bffService.get<SettingsResponse>('/account/settings');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveSettingAction = async (
  colorTheme: string,
  language: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put('/account/settings', {
    colorTheme,
    language,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const postFingerRegOptions = async (): Promise<GenericActionResponse<FingerRegOptions>> => {
  const { data } = await bffService.post<FingerRegOptionsResponse>(
    '/account/fingerprint/register-options',
  );

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const postFingerRegVerify = async (
  commandVerify: FingerRegVerifyCommand,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/account/fingerprint/register-verify', commandVerify);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const deleteFingerReg = async (): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete('/account/fingerprint');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
