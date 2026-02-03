import { bffService } from '@/api/bffService';
import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import { isAxiosError } from 'axios';

interface RecoverResult {
  ok: boolean;
  message?: string;
}

export const emailRecoverAction = async (
  email: string,
  intNum?: number,
): Promise<RecoverResult> => {
  try {
    await bffService.post<ApiBaseResponse>('/account/recover/send-email', {
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

    throw new Error('No se pudo generar el código de recuperación.');
  }
};

export const passChangeAction = async (
  email: string,
  code?: string,
  password?: string,
  confirmPassword?: string,
): Promise<RecoverResult> => {
  try {
    await bffService.put<ApiBaseResponse>('/account/recover', {
      Email: email,
      RecoverCode: code,
      Password: password,
      ConfirmPassword: confirmPassword,
    });

    return { ok: true };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo recuperar la cuenta.');
  }
};
