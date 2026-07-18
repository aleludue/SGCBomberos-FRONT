import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
  GetVehicleTypesResponse,
  VehicleTypeData,
} from '@/features/vehicles/interfaces/vehicles.interfaces';

export const getVehicleTypes = async (): Promise<GenericActionResponse<VehicleTypeData[]>> => {
  const { data } = await bffService.get<GetVehicleTypesResponse>('/vehicles/types');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveVehicleType = async (
  name: string,
  detail: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/vehicles/types', {
    Name: name,
    Detail: detail,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const updateVehicleType = async (
  id: number,
  name: string,
  detail: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/vehicles/types/${id}`, {
    Name: name,
    Detail: detail,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const deleteVehicleType = async (id: number): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete(`/vehicles/types/${id}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
