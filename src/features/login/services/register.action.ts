import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import { useI18n } from 'vue-i18n';

export const registerAction = async (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<GenericActionResponse<null>> => {
  const { t } = useI18n();

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
