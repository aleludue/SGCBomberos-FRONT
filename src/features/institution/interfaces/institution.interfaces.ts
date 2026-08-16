import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetInstitutionResponse extends ApiBaseResponse {
  data: InstitutionData;
}

export interface InstitutionData {
  name: string;
  direction?: string;
  dirNumber?: number;
  dirFloor?: number;
  dirDpto?: string;
  locality?: number;
  province?: number;
  rankSystem?: string;
}

export interface SaveInstitutionDetail {
  name?: string;
  direction?: string;
  dirNum?: number;
  dirFloor?: number;
  dirDpto?: string;
  locality?: number;
  rankSystem?: number;
}
