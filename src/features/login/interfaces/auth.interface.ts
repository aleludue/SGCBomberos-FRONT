import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import type { UserDetail } from '@/features/account/interfaces';

export interface AuthResponse extends ApiBaseResponse {
  data: UserDetail;
}

export interface FingerLogOptionsResponse extends ApiBaseResponse {
  data: FingerLogOptions;
}

export interface FingerLogOptions {
  challenge: string;
  userVerification: 'required' | 'preferred' | 'discouraged';
  rpId: string;
  timeout: number;
  allowCredentials: PublicKeyCredentialDescriptorDto[];
}

export interface PublicKeyCredentialDescriptorDto {
  type: 'public-key';
  id: string;
  transports?: string[];
}

export interface FingerLogVerifyCommand {
  clientResponse: AuthenticatorAssertionRawResponse;
}

export interface AuthenticatorAssertionRawResponse {
  id: string;
  rawId: string;
  response: AssertionResponseDetail;
  type: 'public-key';
  clientExtensionResults?: Record<string, unknown>;
  authenticatorAttachment?: string;
}

export interface AssertionResponseDetail {
  clientDataJSON: string;
  authenticatorData: string;
  signature: string;
  userHandle?: string;
  attestationObject?: string;
}
