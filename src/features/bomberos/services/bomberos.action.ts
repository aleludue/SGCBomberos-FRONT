import { isAxiosError } from 'axios';

import { bffService } from '@/api/bffService';
import type {
  InstBombDetail,
  GetInstitutionBombResponse,
  GetPendingBombResponse,
  PendingBombDetail,
  GetBombDetailResponse,
  BombDetailData,
} from '@/features/bomberos/interfaces/bomberos.interfaces';

interface ServiceResult {
  ok: boolean;
  message?: string;
  data?: InstBombDetail[] | PendingBombDetail[];
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

export const changeStatus = async (bomberoId: string): Promise<ServiceResult> => {
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
  bomberoId: string,
  internalNumber: string,
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

export const changeRole = async (bomberoId: string, roleId: string): Promise<ServiceResult> => {
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

export const getPendingBomb = async (): Promise<ServiceResult> => {
  try {
    const resp = await bffService.get<GetPendingBombResponse>('/bomberos/pending');

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

export const processRequest = async (
  bomberoId: number,
  isApproved: boolean,
): Promise<ServiceResult> => {
  try {
    await bffService.put(`/bomberos/${bomberoId}/institucion`, {
      isApproved,
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

    throw new Error('No se pudo procesar la solicitud.');
  }
};

interface ServiceGetBombResult {
  ok: boolean;
  message?: string;
  data?: BombDetailData;
}

export const getBombDetail = async (bomberoId: string): Promise<ServiceGetBombResult> => {
  try {
    const resp = await bffService.get<GetBombDetailResponse>(`/bomberos/${bomberoId}`);

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

    throw new Error('No se pudo recuperar el detalle del bombero.');
  }
};

export const saveServiceHistory = async (
  bombId: string,
  start: string,
  end?: string,
  endDesc?: string,
): Promise<ServiceResult> => {
  try {
    await bffService.post(`/bomberos/${bombId}/service-history`, {
      ServiceStart: start,
      ServiceFinish: end || null,
      FinishDesc: endDesc || null,
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

    throw new Error('No se pudo guardar el historial de servicio.');
  }
};

export const editServiceHistory = async (
  bombId: string,
  servId: number,
  start: string,
  end?: string,
  endDesc?: string,
): Promise<ServiceResult> => {
  try {
    await bffService.put(`/bomberos/${bombId}/service-history/${servId}`, {
      ServiceStart: start,
      ServiceFinish: end || null,
      FinishDesc: endDesc || null,
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

    throw new Error('No se pudo actualizar el historial de servicio.');
  }
};

export const deleteServiceHistory = async (
  bombId: string,
  servId: number,
): Promise<ServiceResult> => {
  try {
    await bffService.delete(`/bomberos/${bombId}/service-history/${servId}`);

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

    throw new Error('No se pudo eliminar el historial de servicio.');
  }
};

export const changeDriverStatus = async (bomberoId: string): Promise<ServiceResult> => {
  try {
    await bffService.put(`/bomberos/${bomberoId}/driver`);

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
