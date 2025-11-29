import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import type { User } from '@/features/account/interfaces/user.interface';

export interface AuthResponse extends ApiBaseResponse {
  data: User;
}
