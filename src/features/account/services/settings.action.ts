import { bffService } from '@/api/bffService';
import type { UserSettings, SettingsResponse } from '@/features/account/interfaces';
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
