import { isAxiosError } from 'axios';

import { bffService } from '@/api/bffService';
import type {
  InstBombDetail,
  GetInstitutionBombResponse,
} from '@/features/bomberos/interfaces/bomberos.interfaces';

interface ServiceResult {
  ok: boolean;
  message?: string;
  data?: InstBombDetail[];
}

export const getInstitutionBomb = async (): Promise<ServiceResult> => {
  try {
    const resp = await bffService.get<GetInstitutionBombResponse>('/bomberos');

    return {
      ok: resp.data.success,
      message: resp.data.message,
      data: resp.data.data,
    };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo recuperar el listado de bomberos.');
  }
};
