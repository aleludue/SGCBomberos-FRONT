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
    FullName: profileData.fullName,
    Gender: profileData.gender,
    DocType: profileData.docType,
    DocNum: profileData.docNum?.toString(),
    BirthDay: profileData.birthDate,
    HomePhone: profileData.homePhone,
    CellPhone: profileData.cellPhone,
    Direction: profileData.direction,
    DirNum: profileData.dirNum,
    DirFloor: profileData.dirFloor,
    DirDpto: profileData.dirDpto,
    Province: profileData.province,
    Locality: profileData.locality,
  });

  return {
    ok: data.success,
    message: data.message,
    data: data.data,
  };
};
