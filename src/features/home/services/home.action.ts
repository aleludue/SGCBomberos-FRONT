import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type { GetHomeDetailResponse, HomeDetail } from '@/features/home/interfaces/home.interfaces';

export const getHomeDetail = async (): Promise<GenericActionResponse<HomeDetail>> => {
  const { data } = await bffService.get<GetHomeDetailResponse>('/home');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
