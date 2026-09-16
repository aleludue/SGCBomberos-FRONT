import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetHistoryServicesResponse extends ApiBaseResponse {
  data: BombHistoryData;
}

export interface BombHistoryData {
  inService: boolean;
  serviceHistory?: BombHistoryDetail[];
}

export interface BombHistoryDetail {
  id: string;
  dateStart: string;
  dateDown?: string;
  downReason?: string;
}

export interface SaveBombHistory {
  bombId: string;
  serviceStart: string;
  serviceFinish?: string;
  finishDesc?: string;
}
