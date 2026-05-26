import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import axios from 'axios';

export const registerAction = async (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<GenericActionResponse<null>> => {
  try {
    await bffService.post('/account/register', {
      fullName,
      email,
      password,
      confirmPassword,
    });

    return {
      ok: true,
      message: 'Cuenta creada con éxito. Ya puedes iniciar sesión.',
    };
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : 'Error desconocido';

    return { ok: false, message };
  }
};
