import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
  EditTurnConfig,
  GetTurnConfigResponse,
  GetTurnDetailResponse,
  GetTurnsResponse,
  SaveTurn,
  TurnConfigDtl,
  TurnDetailData,
  TurnsData,
} from '@/features/turns/interfaces/turns.interfaces';

export const getTurns = async (): Promise<GenericActionResponse<TurnsData[]>> => {
  const { data } = await bffService.get<GetTurnsResponse>('/turns');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getTurnDetail = async (id: string): Promise<GenericActionResponse<TurnDetailData>> => {
  const { data } = await bffService.get<GetTurnDetailResponse>(`/turns/${id}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getTurnConfig = async (): Promise<GenericActionResponse<TurnConfigDtl>> => {
  const { data } = await bffService.get<GetTurnConfigResponse>('/turns/config');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveTurn = async (request: SaveTurn): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/turns', request);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const editTurn = async (
  id: string,
  request: SaveTurn,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/turns/${id}`, request);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const editTurnConfig = async (
  request: EditTurnConfig,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put('/turns/config', request);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const deleteTurn = async (id: string): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete(`/turns/${id}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
