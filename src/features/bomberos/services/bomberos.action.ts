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

export const getInstitutionBomb = async (
  fullName: string | null,
  internalNum: number | null,
  isActive: boolean | null,
): Promise<ServiceResult> => {
  try {
    const resp = await bffService.get<GetInstitutionBombResponse>('/bomberos', {
      params: {
        fullName,
        internalNum,
        isActive,
      },
    });

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

export const changeStatus = async (bomberoId: number): Promise<ServiceResult> => {
  try {
    await bffService.put(`/bomberos/${bomberoId}/status`);

    return {
      ok: true,
    };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo cambiar el estado del bombero.');
  }
};

export const changeIntNum = async (
  bomberoId: number,
  internalNumber: number,
): Promise<ServiceResult> => {
  try {
    await bffService.put(`/bomberos/${bomberoId}/internal`, {
      internalNumber,
    });

    return {
      ok: true,
    };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo cambiar el numero interno del bombero.');
  }
};

export const changeRole = async (bomberoId: number, roleId: number): Promise<ServiceResult> => {
  try {
    await bffService.put(`/bomberos/${bomberoId}/role`, {
      roleId,
    });

    return {
      ok: true,
    };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo cambiar el rol del bombero.');
  }
};
