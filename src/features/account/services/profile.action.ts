import { bffService } from '@/api/bffService';
import type {
  ProfileDetail,
  ProfileResponse,
  SaveProfileDetail,
} from '@/features/account/interfaces';
import type { GenericActionResponse } from '@/shared/interfaces/common-interface';
import axios from 'axios';

export const getProfileDetail = async (): Promise<GenericActionResponse<ProfileDetail>> => {
  try {
    const { data } = await bffService.get<ProfileResponse>('/account/profile');

    return {
      ok: data.success,
      message: data.message,
      data: data.data,
    };
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : 'Error desconocido';

    return { ok: false, message };
  }
};

export const saveProfileDetail = async (
  profileData: SaveProfileDetail,
): Promise<GenericActionResponse<null>> => {
  try {
    await bffService.put('/account/profile', {
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
      ok: true,
      message: 'Perfil actualizado con éxito',
    };
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : 'Error desconocido';

    return { ok: false, message };
  }
};
