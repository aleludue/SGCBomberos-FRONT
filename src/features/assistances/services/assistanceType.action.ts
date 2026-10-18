import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
  AssistanceTypeData,
  AssistTypeSave,
  GetAssistanceTypesResponse,
} from '@/features/assistances/interfaces/assistances.interfaces';

export const getAssistTypes = async (): Promise<GenericActionResponse<AssistanceTypeData[]>> => {
  const { data } = await bffService.get<GetAssistanceTypesResponse>('/assistances/types');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveAssistType = async (
  detail: AssistTypeSave,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/assistances/types', detail);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const updateAssistType = async (
  id: string,
  detail: AssistTypeSave,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/assistances/types/${id}`, detail);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const deletAssistType = async (id: string): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete(`/assistances/types/${id}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
