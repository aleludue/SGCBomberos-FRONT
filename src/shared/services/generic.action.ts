import { bffService } from '@/api/bffService';
import type {
  GenericActionResponse,
  GenericListResponse,
} from '@/shared/interfaces/common-interface';

export const getProvincesList = async (): Promise<
  GenericActionResponse<GenericListResponse['data']>
> => {
  const resp = await bffService.get<GenericListResponse>('/generic/provinces');

  return {
    ok: resp.data.success,
    message: resp.data.message,
    data: resp.data.data,
  };
};

export const getLocalitiesList = async (
  provId: number,
  searchTerm?: string,
): Promise<GenericActionResponse<GenericListResponse['data']>> => {
  const strSearch = searchTerm ? `&SearchTerm=${searchTerm}` : '';
  const resp = await bffService.get<GenericListResponse>(
    `/generic/localities?ProvinceId=${provId}${strSearch}`,
  );

  return {
    ok: resp.data.success,
    message: resp.data.message,
    data: resp.data.data,
  };
};

export const getDocTypesList = async (): Promise<
  GenericActionResponse<GenericListResponse['data']>
> => {
  const resp = await bffService.get<GenericListResponse>('/generic/doctypes');

  return {
    ok: resp.data.success,
    message: resp.data.message,
    data: resp.data.data,
  };
};

export const getRolesList = async (): Promise<
  GenericActionResponse<GenericListResponse['data']>
> => {
  const resp = await bffService.get<GenericListResponse>('/generic/roles');

  return {
    ok: resp.data.success,
    message: resp.data.message,
    data: resp.data.data,
  };
};
