import type { UserSettings } from '@/features/account/interfaces/user.interface';

export interface ApiBaseResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface ConfigStore extends UserSettings {
  spinnerShow: boolean;
  spinerText?: string;
}
