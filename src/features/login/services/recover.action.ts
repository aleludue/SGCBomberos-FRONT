import { bffService } from '@/api/bffService';
import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import { isAxiosError } from 'axios';

interface RecoverResult {
  ok: boolean;
  message?: string;
}

export const recoverAction = async (email: string, intNum?: number): Promise<RecoverResult> => {
  try {
    await bffService.post<ApiBaseResponse>('/account/recover', {
      Email: email,
      InternalNumber: intNum,
    });

    return { ok: true };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo generar el token de recuperación.');
  }
};
