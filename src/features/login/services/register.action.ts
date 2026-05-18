import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';

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
  } catch (error: any) {
    return error;
  }
};
