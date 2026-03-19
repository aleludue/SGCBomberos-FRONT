import { bffService } from '@/api/bffService';
import type { UserSettings, SettingsResponse } from '@/features/account/interfaces';
import { isAxiosError } from 'axios';

interface ServiceResult {
  ok: boolean;
  message?: string;
  data?: UserSettings;
}

export const getSettingAction = async (): Promise<ServiceResult> => {
  try {
    const resp = await bffService.get<SettingsResponse>('/account/settings');

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

    throw new Error('No se pudo recuperar la configuración del usuario.');
  }
};

export const saveSettingAction = async (
  colorTheme: string,
  language: string,
): Promise<ServiceResult> => {
  try {
    await bffService.put('/account/settings', {
      colorTheme,
      language,
    });

    return {
      ok: true,
    };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo guardar la configuración del usuario.');
  }
};
