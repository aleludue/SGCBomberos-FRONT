import { bffService } from '@/api/bffService';
import type { MenuDetail, MenuResponse } from '@/features/account/interfaces/menu.interface';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import axios from 'axios';

export const menuAction = async (): Promise<GenericActionResponse<MenuDetail[]>> => {
  try {
    const resp = await bffService.get<MenuResponse>('/account/menu');

    return {
      ok: resp.data.success,
      message: resp.data.message,
      data: resp.data.data,
    };
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : 'Error desconocido';

    return { ok: false, message };
  }
};
