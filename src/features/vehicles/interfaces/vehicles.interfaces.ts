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
  data: VehicleMaintenanceData[];
}

export interface VehicleMaintenanceData {
  id: number;
  maintenanceDate: string;
  description: string;
}

export interface GetVehicleToolsDetailsResponse extends ApiBaseResponse {
  data: VehicleToolsData[];
}

export interface VehicleToolsData {
  toolType: string;
  toolList: ToolListDet[];
}

export interface ToolListDet {
  id: number;
  name: string;
  mark: string;
  quantity: number;
  stock: number;
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

export interface VehicleSaveData {
  typeId: number;
  intNum: number;
  mark: string;
  model: string;
  year: number;
  capacityPersonal: number;
  capacityWater: number;
  specializedDriver: boolean;
  dateOfEntry: Date;
}
