import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetAssistanceTypesResponse extends ApiBaseResponse {
  data: AssistanceTypeData[];
}

export interface AssistanceTypeData {
  id: string;
  name: string;
  description?: string;
}

export interface AssistTypeSave {
  name: string;
  description?: string;
}

export interface GetAssistancesResponse extends ApiBaseResponse {
  data: AssistancesData;
}

export interface AssistancesData {
  generalData: AsistGeneralData;
  bombDetailList: AsistBombDetail;
}

export interface AsistGeneralData {
  asistDetail: AsistTypeDetail[];
  totalMinutes: number;
  totalQuantity: number;
}

export interface AsistBombDetail {
  id: string;
  fullName: string;
  internalNumber: number;
  asistDetail: AsistTypeDetail[];
  totalMinutes: number;
  totalMinutesPerc: number;
  totalQuantity: number;
  totalQuantityPerc: number;
}

export interface AsistTypeDetail {
  typeId: string;
  typeName: string;
  minutes: number;
  minutesPerc: number;
  quantity: number;
  quantityPerc: number;
}
