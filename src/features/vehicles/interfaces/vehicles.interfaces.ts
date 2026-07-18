import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface GetVehiclesResponse extends ApiBaseResponse {
  data: VehicleData[];
}

export interface VehicleData {
  id: number;
  internalNumber: number;
  mark: string;
  model: string;
  vehicleType: string;
}

export interface GetVehicleDetailsResponse extends ApiBaseResponse {
  data: VehicleDetailData;
}

export interface VehicleDetailData {
  internalNumber: number;
  mark: string;
  model: string;
  year: number;
  vehicleType: string;
  capacityPersonal: number;
  capacityWater: number;
  specializedDriver: boolean;
  dateOfEntry: Date;
  dateOfRemoval: Date | null;
}

export interface GetVehicleMaintenanceDetailsResponse extends ApiBaseResponse {
  data: VehicleMaintenanceData;
}

export interface VehicleMaintenanceData {
  id: number;
  maintenanceDate: Date;
  description: string;
}

export interface GetVehicleToolsDetailsResponse extends ApiBaseResponse {
  data: VehicleToolsData[];
}

export interface VehicleToolsData {
  id: number;
  name: string;
  mark: string;
  toolType: string;
  quantity: number;
}

export interface GetVehicleTypesResponse extends ApiBaseResponse {
  data: VehicleTypeData[];
}

export interface VehicleTypeData {
  id: number;
  name: string;
  detail?: string;
  cantVehicles: number;
}
