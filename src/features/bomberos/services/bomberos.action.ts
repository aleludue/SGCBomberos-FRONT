import { bffService } from '@/api/bffService';
import type {
  InstBombDetail,
  GetInstitutionBombResponse,
  GetPendingBombResponse,
  PendingBombDetail,
  GetBombDetailResponse,
  BombDetailData,
} from '@/features/bomberos/interfaces/bomberos.interfaces';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';

export const getInstitutionBomb = async (
  fullName: string | null,
  internalNum: number | null,
  isActive: boolean | null,
): Promise<GenericActionResponse<InstBombDetail[]>> => {
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
};

export const changeStatus = async (bomberoId: string): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/bomberos/${bomberoId}/status`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const changeIntNum = async (
  bomberoId: string,
  internalNumber: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/bomberos/${bomberoId}/internal`, {
    internalNumber,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const changeRole = async (
  bomberoId: string,
  roleId: number,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/bomberos/${bomberoId}/role`, {
    roleId,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getPendingBomb = async (): Promise<GenericActionResponse<PendingBombDetail[]>> => {
  const { data } = await bffService.get<GetPendingBombResponse>('/bomberos/pending');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const processRequest = async (
  bomberoId: number,
  isApproved: boolean,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/bomberos/${bomberoId}/institucion`, {
    isApproved,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getBombDetail = async (
  bomberoId: string,
): Promise<GenericActionResponse<BombDetailData>> => {
  const { data } = await bffService.get<GetBombDetailResponse>(`/bomberos/${bomberoId}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveServiceHistory = async (
  bombId: string,
  start: string,
  end?: string,
  endDesc?: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post(`/bomberos/${bombId}/service-history`, {
    ServiceStart: start,
    ServiceFinish: end || null,
    FinishDesc: endDesc || null,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const editServiceHistory = async (
  bombId: string,
  servId: number,
  start: string,
  end?: string,
  endDesc?: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/bomberos/${bombId}/service-history/${servId}`, {
    ServiceStart: start,
    ServiceFinish: end || null,
    FinishDesc: endDesc || null,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const deleteServiceHistory = async (
  bombId: string,
  servId: number,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete(`/bomberos/${bombId}/service-history/${servId}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const changeDriverStatus = async (
  bomberoId: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/bomberos/${bomberoId}/driver`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
