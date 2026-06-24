import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import type { UserSettings } from '@/features/account/interfaces';

export interface SettingsResponse extends ApiBaseResponse {
  data: UserSettings;
}

export interface FingerRegOptionsResponse extends ApiBaseResponse {
  data: FingerRegOptions;
}

export interface FingerRegOptions {
  rp: RpDto;
  user: UserDto;
  challenge: string;
  pubKeyCredParams: PubKeyCredParamDto[];
  timeout: number;
  attestation: string;
  authenticatorSelection: AuthenticatorSelectionDto;
  excludeCredentials: string[];
}

export interface RpDto {
  id: string;
  name: string;
}

export interface UserDto {
  name: string;
  id: string;
  displayName: string;
}

export interface PubKeyCredParamDto {
  type: string;
  alg: number;
}

export interface AuthenticatorSelectionDto {
  residentKey: string;
  userVerification: string;
}

export interface FingerRegVerifyCommand {
  id: string;
  rawId: string;
  type: string;
  response: FingerprintVerifyResponseData;
  extensions: Record<string, unknown>;
  deviceName: string;
}

export interface FingerprintVerifyResponseData {
  clientDataJson: string;
  attestationObject: string;
  transports: string[];
}
