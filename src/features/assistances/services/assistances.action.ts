import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
  AssistanceEditSave,
  AssistanceSave,
  AssistData,
  AssistDetailData,
  AssistReportData,
  GetAssisDetailResponse,
  GetAssistancesResponse,
  GetAssistReportResponse,
} from '@/features/assistances/interfaces/assistances.interfaces';
import { bffService } from '@/api/bffService';

export const getAssistReport = async (
  year: number,
  bombId: string | null,
): Promise<GenericActionResponse<AssistReportData>> => {
  const { data } = await bffService.get<GetAssistReportResponse>('/assistances/report', {
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

export const getAssistances = async (
  typeId: string | null,
  dateFrom: Date,
  dateTo: Date,
): Promise<GenericActionResponse<AssistData[]>> => {
  const { data } = await bffService.get<GetAssistancesResponse>('/assistances', {
    params: {
      typeId,
      dateFrom,
      dateTo,
    },
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getAssistDetail = async (
  id: string,
): Promise<GenericActionResponse<AssistDetailData>> => {
  const { data } = await bffService.get<GetAssisDetailResponse>(`/assistances/${id}`);

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

export const updateAssistance = async (
  id: string,
  detail: AssistanceEditSave,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/assistances/${id}`, detail);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const deleteAssistance = async (id: string): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete(`/assistances/${id}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
