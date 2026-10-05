import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
  GetRankHistoryResponse,
  RankHistoryDetail,
  SaveRankHistory,
} from '@/features/rankHistory/interfaces/rankHistory.interfaces';

export const getRankHistory = async (
  bomberoId: string,
): Promise<GenericActionResponse<RankHistoryDetail[]>> => {
  const { data } = await bffService.get<GetRankHistoryResponse>(
    `/rank-history/bomberos/${bomberoId}`,
  );

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveRankHistory = async (
  request: SaveRankHistory,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/rank-history', request);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const deleteRankHistory = async (
  id: string,
  bombId: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete(`/rank-history/${id}/bomberos/${bombId}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
