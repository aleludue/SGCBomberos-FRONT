import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetHomeDetailResponse extends ApiBaseResponse {
  data: HomeDetail;
}

export interface HomeDetail {
  institution: HomeInstDetail;
  user: HomeUserDetail;
}

export interface HomeInstDetail {
  isApproved: boolean;
  socialReason: string;
  quantityBomb: number;
  quantityVehi: number;
}

export interface HomeUserDetail {
  profileIncomplete: boolean;
}
