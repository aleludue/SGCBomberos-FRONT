import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import type { UserDetail } from '@/features/account/interfaces/user.interface';

export interface AuthResponse extends ApiBaseResponse {
  data: UserDetail;
}
