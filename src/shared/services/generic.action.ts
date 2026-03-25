import { isAxiosError } from 'axios';

import { bffService } from '@/api/bffService';
import type { GenericListResponse } from '@/shared/interfaces/common-interface';

interface ServiceResult {
  ok: boolean;
  message?: string;
  data?: GenericListResponse['data'] | undefined;
}

export const getProvincesList = async (): Promise<ServiceResult> => {
  try {
    const resp = await bffService.get<GenericListResponse>('/generic/provinces');

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
    const resp = await bffService.get<GenericListResponse>(
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

export const getDocTypesList = async (): Promise<ServiceResult> => {
  try {
    const resp = await bffService.get<GenericListResponse>('/generic/doctypes');

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

    throw new Error('No se pudo recuperar la lista de tipos de documento.');
  }
};

export const getRolesList = async (): Promise<ServiceResult> => {
  try {
    const resp = await bffService.get<GenericListResponse>('/generic/roles');

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

    throw new Error('No se pudo recuperar la lista de roles.');
  }
};
