import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';

export interface MenuResponse extends ApiBaseResponse {
  data: MenuDetail[];
}

export interface MenuDetail {
  name: string;
  icon: string;
  feature: string;
  viewName: string;
}
