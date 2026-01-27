import { bffService } from '@/api/bffService';
import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import { isAxiosError } from 'axios';

interface RegResult {
  ok: boolean;
  message?: string;
}

export const registerAction = async (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<RegResult> => {
  try {
    await bffService.post<ApiBaseResponse>('/account/register', {
      fullName,
      email,
      password,
      confirmPassword,
    });

    return { ok: true };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo registrar.');
  }
};
