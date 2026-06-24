import { bffService } from '@/api/bffService';
import type {
  ProfileDetail,
  ProfileResponse,
  SaveProfileDetail,
} from '@/features/account/interfaces';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';

export const getProfileDetail = async (): Promise<GenericActionResponse<ProfileDetail>> => {
  const { data } = await bffService.get<ProfileResponse>('/account/profile');

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};

export const saveProfileDetail = async (
  profileData: SaveProfileDetail,
): Promise<GenericActionResponse<null>> => {
  const { data } = await bffService.put('/account/profile', {
    fullName: profileData.fullName,
    gender: profileData.gender,
    docType: profileData.docType,
    docNum: profileData.docNum,
    birthDay: profileData.birthDate,
    homePhone: profileData.homePhone,
    cellPhone: profileData.cellPhone,
    direction: profileData.direction,
    dirNum: profileData.dirNum,
    dirFloor: profileData.dirFloor,
    dirDpto: profileData.dirDpto,
    province: profileData.province,
    locality: profileData.locality,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
