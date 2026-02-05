import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface ProfileResponse extends ApiBaseResponse {
  data: ProfileDetail;
}

export interface ProfileDetail {
  email: string;
  fullName: string;
  gender?: number;
  docNumber?: number;
  internalNum?: number;
  dateBirth?: Date;
  direction?: string;
  dirNumber?: number;
  dirFloor?: number;
  dirDpto?: number;
  locality?: string;
  province?: string;
  cellPhone?: string;
  homePhone?: string;
}
