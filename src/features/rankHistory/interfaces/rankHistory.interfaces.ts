import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetRankHistoryResponse extends ApiBaseResponse {
  data: RankHistoryDetail[];
}

export interface RankHistoryDetail {
  id: string;
  rankId: string;
  dateStart: string;
  dateDown?: string;
}

export interface SaveRankHistory {
  bombId: string;
  rankId: string;
  rankStart: string;
  rankFinish?: string;
}
