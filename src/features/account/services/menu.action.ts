import { bffService } from '@/api/bffService';
import { isAxiosError } from 'axios';
import type { MenuDetail, MenuResponse } from '../interfaces/menu.interface';

interface ServiceResult {
  ok: boolean;
  message: string;
  data?: MenuDetail[];
}

export const menuAction = async (): Promise<ServiceResult> => {
  try {
    const resp = await bffService.get<MenuResponse>('/account/menu');

    return {
      ok: resp.data.success,
      message: resp.data.message,
      data: resp.data.data,
    };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo recuperar el menu.');
  }
};
