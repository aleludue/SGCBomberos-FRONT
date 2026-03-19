import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import type { UserDetail } from '@/features/account/interfaces';

export interface AuthResponse extends ApiBaseResponse {
  data: UserDetail;
}
