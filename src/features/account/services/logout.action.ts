import { bffService } from '@/api/bffService';
import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import { isAxiosError } from 'axios';

export const logoutAction = async (): Promise<boolean> => {
  try {
    const resp = await bffService.get<ApiBaseResponse>('/account/logout');
    return resp.data.success;
  } catch (error) {
    if (isAxiosError(error)) {
      return false;
    }

    throw new Error('No se pudo cerrar la sesión.');
  }
};
