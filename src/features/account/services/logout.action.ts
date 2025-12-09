import { sgcbApi } from '@/api/sgcbApi';
import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import { isAxiosError } from 'axios';

export const logoutAction = async (): Promise<boolean> => {
  try {
    const resp = await sgcbApi.get<ApiBaseResponse>('/Account/logout');
    return resp.data.success;
  } catch (error) {
    if (isAxiosError(error)) {
      return false;
    }

    throw new Error('No se pudo cerrar la sesión.');
  }
};
