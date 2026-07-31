import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
  GetToolsTypesResponse,
  ToolTypeData,
} from '@/features/tools/interfaces/tools.interfaces';

export const getToolTypes = async (): Promise<GenericActionResponse<ToolTypeData[]>> => {
  const { data } = await bffService.get<GetToolsTypesResponse>('/tools/types');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveToolType = async (
  name: string,
  detail: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/tools/types', {
    Name: name,
    Detail: detail,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const updateToolType = async (
  id: number,
  name: string,
  detail: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/tools/types/${id}`, {
    Name: name,
    Detail: detail,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const deleteToolType = async (id: number): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete(`/tools/types/${id}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
