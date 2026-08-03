import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
  GetToolsResponse,
  ToolSaveData,
  ToolsData,
} from '@/features/tools/interfaces/tools.interfaces';

export const getTools = async (
  typeId: number | null,
  inStock: boolean | null,
): Promise<GenericActionResponse<ToolsData[]>> => {
  const { data } = await bffService.get<GetToolsResponse>('/tools', {
    params: {
      typeId,
      inStock,
    },
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveTool = async (req: ToolSaveData): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/tools', {
    TypeId: req.typeId,
    Name: req.name,
    Mark: req.mark,
    Quantity: req.quantity,
    MovDescription: req.movDescription,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const updateTool = async (
  toolId: number,
  typeId: number,
  name: string,
  mark: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/tools/${toolId}`, {
    TypeId: typeId,
    Name: name,
    Mark: mark,
  });

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
  const { data } = await bffService.delete(
    `/tools/${id}?Quantity=${cant}&MovDescription=${detail}`,
  );

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
