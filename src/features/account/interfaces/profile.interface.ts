import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface ProfileResponse extends ApiBaseResponse {
  data: ProfileDetail;
}

export interface ProfileDetail {
  email: string;
  fullName: string;
  gender?: number;
  docType?: number;
  docNum?: number;
  internalNum?: number;
  dateBirth?: Date;
  direction?: string;
  dirNumber?: number;
  dirFloor?: number;
  dirDpto?: number;
  locality?: string;
  localityId?: number;
  province?: number;
  cellPhone?: string;
  homePhone?: string;
  institution?: number;
  institutionProposed?: number;
}

export interface SaveProfileDetail {
  fullName?: string;
  gender?: number;
  docType?: number;
  docNum?: number;
  birthDay?: Date;
  homePhone?: string;
  cellPhone?: string;
  direction?: string;
  dirNum?: number;
  dirFloor?: number;
  dirDpto?: string;
  province?: number;
  locality?: number;
  institutionProposed?: number;
}
