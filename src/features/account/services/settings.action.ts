import { bffService } from '@/api/bffService';
import type { UserSettings } from '@/features/account/interfaces';
import type { SettingsResponse } from '@/features/account/interfaces/settings.interface';
import { isAxiosError } from 'axios';

interface ServiceResult {
  ok: boolean;
  message: string;
  data?: UserSettings;
}

export const settingAction = async (): Promise<ServiceResult> => {
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
