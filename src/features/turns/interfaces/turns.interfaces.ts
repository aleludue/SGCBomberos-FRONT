import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetTurnsResponse extends ApiBaseResponse {
  data: TurnsData[];
}

export interface TurnsData {
  id: string;
  name: string;
  rotationOrder: number;
  cantBomb: number;
}

export interface GetTurnDetailResponse extends ApiBaseResponse {
  data: TurnDetailData;
}

export interface TurnDetailData {
  name: string;
  description?: string;
  rotationOrder: number;
  bomberos: string[];
}

export interface SaveTurn {
  name: string;
  description?: string;
  bomberos: string[];
}
