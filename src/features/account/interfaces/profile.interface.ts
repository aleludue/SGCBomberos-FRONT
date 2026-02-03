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
}
