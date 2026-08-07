import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetToolsTypesResponse extends ApiBaseResponse {
  data: ToolTypeData[];
}

export interface ToolTypeData {
  id: number;
  name: string;
  detail?: string;
  cantTools: number;
}

export interface GetToolsResponse extends ApiBaseResponse {
  data: ToolsData[];
}

export interface ToolsData {
  id: number;
  name: string;
  mark: string;
  quantity: number;
  toolType: string;
}

export interface ToolSaveData {
  typeId: number;
  name: string;
  mark: string;
  quantity: number;
  movDescription: string;
}

export interface GetToolsMovementsResponse extends ApiBaseResponse {
  data: ToolMovData;
}

export interface ToolMovData {
  tool: ToolsData;
  movements: ToolMovDetailsData[];
}

export interface ToolMovDetailsData {
  id: number;
  description?: string;
  createdAt: string;
  movementType: string;
  quantity: number;
  vehicle: string;
}
