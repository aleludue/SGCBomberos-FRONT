import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetInstitutionResponse extends ApiBaseResponse {
  data: InstitutionData;
}

export interface InstitutionData {
  socialReason: string;
  cuit: string;
  ipjMatricula?: string;
  quarterNumber?: number;
  regionalNumber?: number;
  foundationDate?: Date;
  direction?: string;
  dirNumber?: number;
  dirFloor?: number;
  dirDpto?: string;
  locality?: string;
  province?: string;
  rankSystem?: string;
  emergencyPhone?: string;
  adminPhone?: string;
  email?: string;
}
