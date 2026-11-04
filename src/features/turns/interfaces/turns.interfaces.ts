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

export interface GetTurnConfigResponse extends ApiBaseResponse {
  data: TurnConfigDtl;
}

export interface TurnConfigDtl {
  startDate: Date;
  durationDays: number;
  turnos: TurnDet[];
}

export interface TurnDet {
  id: string;
  name: string;
  rotationOrder: number;
}

export interface EditTurnConfig {
  startDate: Date;
  durationDays: number;
  turnos: string[];
}
