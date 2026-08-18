import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
  GetToolsMovementsResponse,
  GetToolsResponse,
  ToolMovData,
  ToolSaveData,
  ToolsData,
} from '@/features/tools/interfaces/tools.interfaces';

export const getTools = async (
  typeId: number | null,
  inStock: boolean | null,
  searchTerm: string | null,
): Promise<GenericActionResponse<ToolsData[]>> => {
  const { data } = await bffService.get<GetToolsResponse>('/tools', {
    params: {
      typeId,
      inStock,
      searchTerm,
    },
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getToolsMovements = async (
  toolId: string,
): Promise<GenericActionResponse<ToolMovData>> => {
  const { data } = await bffService.get<GetToolsMovementsResponse>(`/tools/${toolId}/movements`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveTool = async (req: ToolSaveData): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/tools', req);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const updateTool = async (
  toolId: number,
  req: ToolSaveData,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/tools/${toolId}`, req);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const deleteTool = async (
  id: number,
  cant: number,
  detail?: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete(`/tools/${id}`, {
    params: {
      quantity: cant,
      movDescription: detail || '',
    },
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
