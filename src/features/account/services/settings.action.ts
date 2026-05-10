import { bffService } from '@/api/bffService';
import type { UserSettings, SettingsResponse } from '@/features/account/interfaces';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';

export const getSettingAction = async (): Promise<GenericActionResponse<UserSettings>> => {
  try {
    const { data } = await bffService.get<SettingsResponse>('/account/settings');

    return {
      ok: data.success,
      message: data.message,
      data: data.data,
    };
  } catch (error: any) {
    return error;
  }
};

export const saveSettingAction = async (
  colorTheme: string,
  language: string,
): Promise<GenericActionResponse<null>> => {
  try {
    await bffService.put('/account/settings', {
      colorTheme,
      language,
    });

    return {
      ok: true,
      message: 'Cambios guardados',
    };
  } catch (error: any) {
    return error;
  }
};
