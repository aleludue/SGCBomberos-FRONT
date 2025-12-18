export interface ApiBaseResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface ConfigStore {
  spinnerShow: boolean;
  spinerText?: string;
  siteColorMode: 'light' | 'dark';
}
