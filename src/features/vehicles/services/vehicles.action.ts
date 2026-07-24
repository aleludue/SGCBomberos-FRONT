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
  VehicleSaveData,
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
): Promise<GenericActionResponse<VehicleMaintenanceData[]>> => {
  const { data } = await bffService.get<GetVehicleMaintenanceDetailsResponse>(
    `/vehicles/${id}/maintenances`,
  );

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveVehicleMaintenance = async (
  vehiId: number,
  maintenanceDate: string,
  description: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post(`/vehicles/${vehiId}/maintenances`, {
    MaintenanceDate: maintenanceDate,
    Description: description,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const updateVehicleMaintenance = async (
  id: number,
  vehiId: number,
  maintenanceDate: string,
  description: string,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/vehicles/${vehiId}/maintenances/${id}`, {
    Description: description,
    MaintenanceDate: maintenanceDate,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const deleteVehicleMaintenance = async (
  id: number,
  vehiId: number,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.delete(`/vehicles/${vehiId}/maintenances/${id}`);

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

export const saveVehicle = async (req: VehicleSaveData): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.post('/vehicles', {
    TypeId: req.typeId,
    InternalNumber: req.intNum,
    Mark: req.mark,
    Model: req.model,
    Year: req.year,
    PersonCapacity: req.capacityPersonal,
    WaterCapacity: req.capacityWater,
    SpecializedDriver: req.specializedDriver,
    EntryDate: req.dateOfEntry,
    RemoveDate: req.dateOfRemoval || null,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const updateVehicle = async (
  id: number,
  req: VehicleSaveData,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put(`/vehicles/${id}`, {
    TypeId: req.typeId,
    InternalNumber: req.intNum,
    Mark: req.mark,
    Model: req.model,
    Year: req.year,
    PersonCapacity: req.capacityPersonal,
    WaterCapacity: req.capacityWater,
    SpecializedDriver: req.specializedDriver,
    EntryDate: req.dateOfEntry,
    RemoveDate: req.dateOfRemoval || null,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
