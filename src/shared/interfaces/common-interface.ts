import type { UserSettings } from '@/features/account/interfaces';

export interface ApiBaseResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface ConfigStore extends UserSettings {
  spinnerShow: boolean;
  spinerText?: string;
}

export interface ProvincesListResponse extends ApiBaseResponse {
  data: { id: number; name: string }[];
}
