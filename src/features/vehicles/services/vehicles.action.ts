import { bffService } from '@/api/bffService';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import type {
  GetVehicleDetailsResponse,
  GetVehicleMaintenanceDetailsResponse,
  GetVehiclesResponse,
  GetVehicleToolsDetailsResponse,
  VehicleData,
  VehicleDetailData,
  VehicleMaintenanceData,
  VehicleToolsData,
} from '@/features/vehicles/interfaces/vehicles.interfaces';

export const getVehicles = async (): Promise<GenericActionResponse<VehicleData[]>> => {
  const { data } = await bffService.get<GetVehiclesResponse>('/vehicles');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getVehicleDetails = async (
  id: number,
): Promise<GenericActionResponse<VehicleDetailData>> => {
  const { data } = await bffService.get<GetVehicleDetailsResponse>(`/vehicles/${id}`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getVehicleMaintenanceDetails = async (
  id: number,
): Promise<GenericActionResponse<VehicleMaintenanceData>> => {
  const { data } = await bffService.get<GetVehicleMaintenanceDetailsResponse>(
    `/vehicles/${id}/maintenances`,
  );

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const getVehicleToolsDetails = async (
  id: number,
): Promise<GenericActionResponse<VehicleToolsData[]>> => {
  const { data } = await bffService.get<GetVehicleToolsDetailsResponse>(`/vehicles/${id}/tools`);

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveVehicle = async (
  typeId: number,
  intNum: number,
  mark: string,
  model: string,
  year: number,
  capacityPersonal: number,
  capacityWater: number,
  specializedDriver: boolean,
  dateOfEntry: Date,
  dateOfRemoval?: Date | null,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/vehicles', {
    TypeId: typeId,
    InternalNumber: intNum,
    Mark: mark,
    Model: model,
    Year: year,
    PersonCapacity: capacityPersonal,
    WaterCapacity: capacityWater,
    SpecializedDriver: specializedDriver,
    EntryDate: dateOfEntry,
    RemoveDate: dateOfRemoval || null,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const updateVehicle = async (
  id: number,
  typeId: number,
  intNum: number,
  mark: string,
  model: string,
  year: number,
  capacityPersonal: number,
  capacityWater: number,
  specializedDriver: boolean,
  dateOfEntry: Date,
  dateOfRemoval?: Date | null,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/vehicles/${id}`, {
    TypeId: typeId,
    InternalNumber: intNum,
    Mark: mark,
    Model: model,
    Year: year,
    PersonCapacity: capacityPersonal,
    WaterCapacity: capacityWater,
    SpecializedDriver: specializedDriver,
    EntryDate: dateOfEntry,
    RemoveDate: dateOfRemoval || null,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
