import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
  AssistanceSave,
  AssistancesData,
  GetAssistancesResponse,
} from '@/features/assistances/interfaces/assistances.interfaces';
import { bffService } from '@/api/bffService';

export const getAssistances = async (
  bombId: string | null,
  year: number,
): Promise<GenericActionResponse<AssistancesData>> => {
  const { data } = await bffService.get<GetAssistancesResponse>('/assistances', {
    params: {
      bombId,
      year,
    },
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveAssistance = async (
  detail: AssistanceSave,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/assistances', detail);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
