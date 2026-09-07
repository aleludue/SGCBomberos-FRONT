import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetIntervTypesResponse extends ApiBaseResponse {
  data: CatListData[];
}

export interface CatListData {
  classifName: string;
  types: IntervTypeData[];
}

export interface IntervTypeData {
  id: number;
  name: string;
}
