import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetInstitutionBombResponse extends ApiBaseResponse {
  data: InstBombDetail[];
}

export interface InstBombDetail {
  id: number;
  email: string;
  fullName: string;
  internalNum: number;
  isActive: boolean;
  role?: number;
}
