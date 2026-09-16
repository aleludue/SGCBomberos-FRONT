import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetIntervTypesResponse extends ApiBaseResponse {
  data: CatListData[];
}

export interface CatListData {
  classifName: string;
  types: IntervTypeData[];
}

export interface IntervTypeData {
  id: string;
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

export interface SaveIntervRequest {
  actNumber: number;
  startAt: Date;
  endAt?: Date;
  description?: string;
  isDraft: boolean;

  informantName: string;
  informantDocument?: string;
  informantPhone?: string;
  informantCallTime?: string;
  informantExtraDetail?: string;
  address: string;
  addressExtraDetail?: string;

  localityId: string;
  intervTypeId: string;
  notificationMethodId: string;
  notificationRecipId: string;
  commandChiefId: string;

  bomberos: IntervBombList[];
  vehicles: IntervVehiList[];
  damagedPeople: IntervDmgPerson[];
  damagedProperties: IntervDmgProperty[];
  damagedVehicles: IntervDmgVehicle[];
}

export interface IntervBombList {
  bomberoId: string;
  goIntervention: boolean;
}

export interface IntervVehiList {
  vehicleId: string;
  driverId: string;
}
