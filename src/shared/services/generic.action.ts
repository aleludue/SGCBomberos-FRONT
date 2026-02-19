import { bffService } from '@/api/bffService';
import { isAxiosError } from 'axios';
import type { ProvincesListResponse } from '@/shared/interfaces/common-interface';

interface ServiceResult {
  ok: boolean;
  message?: string;
  data?: ProvincesListResponse['data'] | undefined;
}

export const getProvincesList = async (): Promise<ServiceResult> => {
  try {
    const resp = await bffService.get<ProvincesListResponse>('/generic/provinces');

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

    throw new Error('No se pudo recuperar la lista de provincias.');
  }
};

export const getLocalitiesList = async (
  provId: number,
  searchTerm: string,
): Promise<ServiceResult> => {
  try {
    const resp = await bffService.get<ProvincesListResponse>(
      `/generic/localities?ProvinceId=${provId}&SearchTerm=${searchTerm}`,
    );

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

    throw new Error('No se pudo recuperar la lista de localidades.');
  }
};
