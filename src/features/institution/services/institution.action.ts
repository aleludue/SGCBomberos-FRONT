import { bffService } from '@/api/bffService';
import type {
  GenericActionResponse,
  GenericListResponse,
} from '@/shared/interfaces/common-interface';
import type {
  GetInstitutionResponse,
  InstitutionData,
} from '@/features/institution/interfaces/institution.interfaces';

export const getInstitution = async (): Promise<GenericActionResponse<InstitutionData>> => {
  const { data } = await bffService.get<GetInstitutionResponse>('/institution');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getInstitutions = async (): Promise<
  GenericActionResponse<GenericListResponse['data']>
> => {
  const { data } = await bffService.get<GenericListResponse>('/institutions');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getRanks = async (): Promise<GenericActionResponse<GenericListResponse['data']>> => {
  const { data } = await bffService.get<GenericListResponse>('/institution/ranks');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getRankSystems = async (): Promise<
  GenericActionResponse<GenericListResponse['data']>
> => {
  const { data } = await bffService.get<GenericListResponse>('/institutions/rank-systems');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveInstitution = async (
  instData: InstitutionData,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put('/institution', instData);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
