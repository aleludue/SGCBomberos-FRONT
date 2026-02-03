import { bffService } from '@/api/bffService';
import type { ProfileDetail, ProfileResponse } from '@/features/account/interfaces';
import { isAxiosError } from 'axios';

interface ServiceResult {
  ok: boolean;
  message?: string;
  data?: ProfileDetail;
}

export const getProfileDetail = async (): Promise<ServiceResult> => {
  try {
    const resp = await bffService.get<ProfileResponse>('/account/profile');

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

    throw new Error('No se pudo recuperar el perfil del usuario.');
  }
};
