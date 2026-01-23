import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import type { UserSettings } from '@/features/account/interfaces';

export interface SettingsResponse extends ApiBaseResponse {
  data: UserSettings;
}
