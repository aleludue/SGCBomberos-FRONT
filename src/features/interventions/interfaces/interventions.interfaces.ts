import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetIntervTypesResponse extends ApiBaseResponse {
  data: CatListData[];
}

export interface CatListData {
  id: string;
  classifName: string;
  types: IntervTypeData[];
}

export interface IntervTypeData {
  id: string;
  name: string;
}

export interface IntervDmgPerson {
  id?: string;
  fullName: string;
  docNumber?: string;
  address?: string;
  healthStatus: string;
  transferDestination?: string;
}

export interface IntervDmgVehicle {
  id?: string;
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
  id?: string;
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
  bombRecipId: string;

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

export interface GetInterventionsResponse extends ApiBaseResponse {
  data: IntervData[];
}

export interface IntervData {
  id: string;
  actNumber: string;
  status: string;
  intervType: string;
  creator: string;
  commandChief: string;
}

export interface GetIntervDetailResponse extends ApiBaseResponse {
  data: IntervDetailData;
}

export interface IntervDetailData {
  id: string;
  actNumber: string;
  startAt: Date;
  endAt?: Date;

  informantName: string;
  informantDocument?: string;
  informantPhone?: string;
  informantCallTime?: string;
  informantExtraDetail?: string;
  notificationRecipId: number;

  address: string;
  addressExtraDetail?: string;
  description?: string;
  status: string;

  provinceId: string;
  localityId: string;
  intervTypeId: string;
  intervCatTypeId: string;
  notificationMethodId: string;
  commandChiefId: string;
  creatorId: string;
  bombRecipId: string;

  bomberos: IntervBombList[];
  vehiculos: IntervVehiList[];
  dmgPeople: IntervDmgPerson[];
  dmgProperties: IntervDmgProperty[];
  dmgVehicles: IntervDmgVehicle[];
}

export interface IntervDataDet {
  startAt: Date | undefined;
  endAt?: Date | undefined;
  description: string;
  informantName: string;
  informantDocument: number;
  informantPhone: string;
  informantCallTime: Date | undefined;
  informantExtraDetail: string;
  notificationMethodId: number;
  notificationRecipId: number;
  bombRecipId: string;
  address: string;
  addressExtraDetail: string;
  provinceId: string;
  localityId: string;
  intervTypeId: string;
  intervCatTypeId: string;
  commandChiefId: string;
  actNumber: string;
}
