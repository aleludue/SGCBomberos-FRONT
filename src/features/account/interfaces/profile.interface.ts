import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface ProfileResponse extends ApiBaseResponse {
  data: ProfileDetail;
}

export interface ProfileDetail {
  email: string;
  fullName: string;
  gender?: number;
  docType?: string;
  docNum?: number;
  internalNum?: number;
  dateBirth?: Date;
  direction?: string;
  dirNumber?: number;
  dirFloor?: number;
  dirDpto?: string;
  locality?: string;
  province?: string;
  cellPhone?: string;
  homePhone?: string;
  institution?: string;
  institutionProposed?: string;
}

export interface SaveProfileDetail {
  fullName?: string;
  gender?: number;
  docType?: string;
  docNum?: number;
  dateBirth?: Date;
  homePhone?: string;
  cellPhone?: string;
  direction?: string;
  dirNum?: number;
  dirFloor?: number;
  dirDpto?: string;
  locality?: string;
  institutionProposed?: string;
}
