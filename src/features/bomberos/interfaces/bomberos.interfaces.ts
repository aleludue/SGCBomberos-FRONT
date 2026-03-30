import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetInstitutionBombResponse extends ApiBaseResponse {
  data: InstBombDetail[];
}

export interface InstBombDetail extends PendingBombDetail {
  internalNum: number;
  isActive: boolean;
  role?: number;
}

export interface GetPendingBombResponse extends ApiBaseResponse {
  data: PendingBombDetail[];
}

export interface PendingBombDetail {
  id: number;
  fullName: string;
  email: string;
}
