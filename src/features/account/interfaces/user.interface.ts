export interface UserDetail {
  user: UserData;
  settings: UserSettings;
}

export interface UserData {
  email: string;
  fullName: string;
  isActive: boolean;
}

export interface UserSettings {
  siteColorMode: 'light' | 'dark' | 'default';
  siteLanguage: 'es' | 'en';
  fingerprints?: FingerprintList[];
}

export interface FingerprintList {
  id: string;
  deviceName: string;
  createdAt: Date;
}
