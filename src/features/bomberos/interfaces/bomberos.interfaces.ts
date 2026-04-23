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

export interface GetBombDetailResponse extends ApiBaseResponse {
  data: BombDetailData;
}

export interface BombDetailData {
  user: BombDetail;
  serviceHistory: BombHistoryDetail[];
}

export interface BombDetail {
  fullName: string;
  email: string;
  gender?: number;
  docType?: string;
  docNum?: number;
  dateBirth?: Date;
  direction?: string;
  dirNumber?: number;
  dirFloor?: number;
  dirDpto?: number;
  locality?: string;
  province?: string;
  cellPhone?: string;
  homePhone?: string;
  internalNum: number;
  isActive: boolean;
  isDriver: boolean;
  role?: string;
}

export interface BombHistoryDetail {
  id: number;
  dateStart: string;
  dateDown?: string;
  downReason?: string;
}
