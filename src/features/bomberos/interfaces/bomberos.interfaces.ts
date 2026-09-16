import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetInstitutionBombResponse extends ApiBaseResponse {
  data: InstBombDetail[];
}

export interface InstBombDetail extends PendingBombDetail {
  internalNum: number;
  isActive: boolean;
  role?: string;
}

export interface GetPendingBombResponse extends ApiBaseResponse {
  data: PendingBombDetail[];
}

export interface PendingBombDetail {
  id: string;
  fullName: string;
  email: string;
}

export interface GetBombDetailResponse extends ApiBaseResponse {
  data: BombDetailData;
}

export interface BombDetailData {
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
  rank?: string;
}

export interface BombTableItem {
  id: string;
  fullName: string;
  email: string;
  internalNumber: number;
  isActive: string;
  role: string;
}

export interface SaveBombRequest {
  fullName: string;
  email: string;
  isDriver: boolean;
  roleId?: string;
  rankId?: string;
  internalNum?: number;
  serviceStart?: Date;
}

export interface GetBombInServiceResponse extends ApiBaseResponse {
  data: BombInSeriveData[];
}

export interface BombInSeriveData {
  id: string;
  fullName: string;
  internalNum: number;
  isDriver: boolean;
}
