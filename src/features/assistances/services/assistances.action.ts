import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
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
