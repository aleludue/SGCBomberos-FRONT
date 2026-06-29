import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetHistoryServicesResponse extends ApiBaseResponse {
  data: BombHistoryData;
}

export interface BombHistoryData {
  inService: boolean;
  serviceHistory?: BombHistoryDetail[];
}

export interface BombHistoryDetail {
  id: number;
  dateStart: string;
  dateDown?: string;
  downReason?: string;
}
