import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
  BombHistoryData,
  GetHistoryServicesResponse,
  SaveBombHistory,
} from '@/features/serviceHistory/interfaces/servicehistory.interfaces';

export const saveServiceHistory = async (
  request: SaveBombHistory,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/service-history', request);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const editServiceHistory = async (
  servId: string,
  request: SaveBombHistory,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/service-history/${servId}`, request);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const deleteServiceHistory = async (
  servId: string,
  bombId: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete(`/service-history/${servId}/bomberos/${bombId}`);

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
