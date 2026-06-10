import { bffService } from '@/api/bffService';
import { i18n } from '@/config/i18n';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';

const t = i18n.global.t;

export const emailRecoverAction = async (
  email: string,
  intNum?: number,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/account/recover/send-email', {
    Email: email,
    InternalNumber: intNum,
  });

  return {
    ok: data.success,
    message: data.success ? t('Messages.SuccessCodeSend') : data.message,
    data: data.data,
  };
};

export const passChangeAction = async (
  email: string,
  code?: string,
  password?: string,
  confirmPassword?: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.patch('/account/recover', {
    Email: email,
    RecoverCode: code,
    Password: password,
    ConfirmPassword: confirmPassword,
  });

  return {
    ok: data.success,
    message: data.success ? t('Messages.SuccessRecover') : data.message,
    data: data.data,
  };
};
