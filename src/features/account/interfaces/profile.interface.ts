import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface ProfileResponse extends ApiBaseResponse {
  data: ProfileDetail;
}

export interface ProfileDetail {
  email: string;
  fullName: string;
  gender?: number;
  docNum?: string;
  internalNum?: number;
  dateBirth?: Date;
  direction?: string;
  dirNumber?: number;
  dirFloor?: number;
  dirDpto?: number;
  locality?: string;
  province?: number;
  cellPhone?: string;
  homePhone?: string;
}

export interface SaveProfileDetail {
  fullName?: string;
  gender?: number;
  docNum?: number;
  birthDate?: Date;
  homePhone?: string;
  cellPhone?: string;
  direction?: string;
  dirNum?: number;
  dirFloor?: number;
  dirDpto?: number;
  province?: number;
  locality?: number;
}
