import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import axios from 'axios';

export const emailRecoverAction = async (
  email: string,
  intNum?: number,
): Promise<GenericActionResponse<null>> => {
  try {
    await bffService.post('/account/recover/send-email', {
      Email: email,
      InternalNumber: intNum,
    });

    return {
      ok: true,
      message: 'Si el correo existe, recibirás un código de recuperación pronto.',
    };
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : 'Error desconocido';

    return { ok: false, message };
  }
};

export const passChangeAction = async (
  email: string,
  code?: string,
  password?: string,
  confirmPassword?: string,
): Promise<GenericActionResponse<null>> => {
  try {
    await bffService.put('/account/recover', {
      Email: email,
      RecoverCode: code,
      Password: password,
      ConfirmPassword: confirmPassword,
    });

    return {
      ok: true,
      message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.',
    };
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : 'Error desconocido';

    return { ok: false, message };
  }
};
