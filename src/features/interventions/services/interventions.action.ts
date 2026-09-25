import { bffService } from '@/api/bffService';

import type {
  GenericActionResponse,
  GenericListResponse,
} from '@/shared/interfaces/common-interface';

import type {
  GetIntervTypesResponse,
  CatListData,
  SaveIntervRequest,
  IntervData,
  GetInterventionsResponse,
  GetIntervDetailResponse,
  IntervDetailData,
} from '@/features/interventions/interfaces/interventions.interfaces';

export const getIntervNotifMethods = async (): Promise<
  GenericActionResponse<GenericListResponse['data']>
> => {
  const resp = await bffService.get<GenericListResponse>('/interventions/notif-methods');

  return {
    ok: resp.data.success,
    message: resp.data.message,
    data: resp.data.data,
  };
};

export const getIntervTypes = async (): Promise<GenericActionResponse<CatListData[]>> => {
  const { data } = await bffService.get<GetIntervTypesResponse>('/interventions/types');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getInterventions = async (
  toManage: boolean,
  status?: string | null,
  dateFrom?: Date | null,
  dateTo?: Date | null,
): Promise<GenericActionResponse<IntervData[]>> => {
  const { data } = await bffService.get<GetInterventionsResponse>('/interventions', {
    params: {
      toManage,
      status,
      dateFrom,
      dateTo,
    },
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getIntervDetail = async (
  id: string,
): Promise<GenericActionResponse<IntervDetailData>> => {
  const { data } = await bffService.get<GetIntervDetailResponse>(`/interventions/${id}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveIntervention = async (
  intervDet: SaveIntervRequest,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/interventions', intervDet);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const updateIntervention = async (
  id: string,
  intervDet: SaveIntervRequest,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/interventions/${id}`, intervDet);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const updateIntervStatus = async (
  id: string,
  isApproved: boolean,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.patch(`/interventions/${id}/manage`, {
    isApproved,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const deleteIntervention = async (id: string): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete(`/interventions/${id}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
