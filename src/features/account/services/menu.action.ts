import { bffService } from '@/api/bffService';
import type { MenuDetail, MenuResponse } from '@/features/account/interfaces/menu.interface';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';

export const menuAction = async (): Promise<GenericActionResponse<MenuDetail[]>> => {
  try {
    const resp = await bffService.get<MenuResponse>('/account/menu');

    return {
      ok: resp.data.success,
      message: resp.data.message,
      data: resp.data.data,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message || 'Error inesperado',
    };
  }
};
