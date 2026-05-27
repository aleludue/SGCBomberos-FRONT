import { bffService } from '@/api/bffService';
import type { MenuDetail, MenuResponse } from '@/features/account/interfaces/menu.interface';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';

export const menuAction = async (): Promise<GenericActionResponse<MenuDetail[]>> => {
  const { data } = await bffService.get<MenuResponse>('/account/menu');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
