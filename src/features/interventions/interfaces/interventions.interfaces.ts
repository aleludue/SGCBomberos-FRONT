import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetIntervTypesResponse extends ApiBaseResponse {
  data: CatListData[];
}

export interface CatListData {
  classifName: string;
  types: IntervTypeData[];
}

export interface IntervTypeData {
  id: number;
  name: string;
}

export interface IntervDmgPerson {
  id?: number;
  fullName: string;
  docNumber?: string;
  address?: string;
  healthStatus: string;
  transferDestination?: string;
}

export interface IntervDmgVehicle {
  id?: number;
  mark: string;
  model: string;
  licensePlate?: string;
  hasAirbag: boolean;
  ownerFullName: string;
  ownerDocNumber?: string;
  ownerAddress?: string;
  insuranceCompanyName?: string;
}

export interface IntervDmgProperty {
  id?: number;
  propertyType: string;
  roomsCount?: number;
  constructionType?: string;
  ownerFullName: string;
  ownerDocNumber?: string;
  ownerAddress?: string;
  insuranceCompanyName?: string;
  insuranceSocialReason?: string;
  insuranceBranch?: string;
}
