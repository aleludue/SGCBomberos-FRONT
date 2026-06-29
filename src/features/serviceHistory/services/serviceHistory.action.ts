import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
  BombHistoryData,
  GetHistoryServicesResponse,
} from '@/features/serviceHistory/interfaces/servicehistory.interfaces';

export const saveServiceHistory = async (
  bombId: string,
  start: string,
  end?: string,
  endDesc?: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post(`/service-history/bomberos/${bombId}`, {
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
  servId: number,
  start: string,
  end?: string,
  endDesc?: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/service-history/${servId}`, {
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
  servId: number,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete(`/service-history/${servId}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getServiceHistory = async (
  bomberoId: string,
): Promise<GenericActionResponse<BombHistoryData>> => {
  const { data } = await bffService.get<GetHistoryServicesResponse>(
    `/service-history/bomberos/${bomberoId}`,
  );

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
