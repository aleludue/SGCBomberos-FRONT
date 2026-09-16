import { bffService } from '@/api/bffService';

import type {
  GenericActionResponse,
  GenericListResponse,
} from '@/shared/interfaces/common-interface';

import type {
  GetIntervTypesResponse,
  CatListData,
  SaveIntervRequest,
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
