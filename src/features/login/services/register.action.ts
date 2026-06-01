import { bffService } from '@/api/bffService';
import { i18n } from '@/config/i18n';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';

const t = i18n.global.t;

export const registerAction = async (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/account/register', {
    fullName,
    email,
    password,
    confirmPassword,
  });

  return {
    ok: data.success,
    message: data.success ? t('Messages.SuccessRegister') : data.message,
    data: data.data,
  };
};
