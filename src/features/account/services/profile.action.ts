import { bffService } from '@/api/bffService';
import type {
  ProfileDetail,
  ProfileResponse,
  SaveProfileDetail,
} from '@/features/account/interfaces';
import type { ApiBaseResponse } from '@/shared/interfaces/common-interface';
import { isAxiosError } from 'axios';

interface ServiceResult {
  ok: boolean;
  message?: string;
  data?: ProfileDetail;
}

export const getProfileDetail = async (): Promise<ServiceResult> => {
  try {
    const resp = await bffService.get<ProfileResponse>('/account/profile');

    return {
      ok: resp.data.success,
      message: resp.data.message,
      data: resp.data.data,
    };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo recuperar el perfil del usuario.');
  }
};

export const saveProfileDetail = async (profileData: SaveProfileDetail): Promise<ServiceResult> => {
  try {
    await bffService.put<ApiBaseResponse>('/account/profile', {
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
    };
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 409)) {
      return {
        ok: false,
        message: error.response.data.message,
      };
    }

    throw new Error('No se pudo guardar el perfil del usuario.');
  }
};
