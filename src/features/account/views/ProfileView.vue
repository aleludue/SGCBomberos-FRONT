<template>
  <title>{{ $t('ProfileView.ViewTitle') }}</title>

  <div class="container">
    <SectionTitle
      :title="$t('ProfileView.Title')"
      :subtitle="$t('ProfileView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('ProfileView.Title') }]"
    />

    <form @submit.prevent="saveChanges" class="mt-2 p-3 rounded shadow">
      <FormTitle :titleText="$t('ProfileView.SectionBaseData')" />

      <div class="d-flex flex-wrap row g-3 align-items-center">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formFullName" class="form-label">
            {{ $t('ProfileView.FullNameTitle') }}
          </label>
          <input
            v-model="fullNameValue"
            type="text"
            class="form-control"
            id="formFullName"
            @blur="fullNameBlur"
          />
          <span v-if="fullNameError" class="text-danger">{{ fullNameError }}</span>
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <InputGender
            :label-text="$t('ProfileView.GenderTitle')"
            :gender="profileDetails.gender"
          ></InputGender>
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formEmail" class="form-label"> {{ $t('ProfileView.EmailTitle') }} </label>
          <input
            type="email"
            readonly
            class="form-control"
            id="formEmail"
            :value="profileDetails.email"
          />
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formIntNum" class="form-label">
            {{ $t('ProfileView.InternalNumTitle') }}
          </label>
          <input
            type="text"
            readonly
            class="form-control"
            id="formIntNum"
            :value="profileDetails.internalNum"
          />
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formDocType" class="form-label">
            {{ $t('ProfileView.DocTypeTitle') }}
          </label>
          <select class="form-select" id="formDocType" v-model="docTypeValue" @blur="docTypeBlur">
            <option value="0" selected>{{ $t('ProfileView.DocTypeSelect') }}</option>
            <option v-for="value in docTypesList" :key="value.id" :value="value.id">
              {{ value.name }}
            </option>
          </select>
          <span v-if="docTypeError" class="text-danger">{{ docTypeError }}</span>
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formDocNumber" class="form-label">
            {{ $t('ProfileView.DocumentNumTitle') }}
          </label>
          <input
            v-model="docNumValue"
            type="text"
            class="form-control"
            id="formDocNumber"
            @blur="docNumBlur"
          />
          <span v-if="docNumError" class="text-danger">{{ docNumError }}</span>
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formDateBirth" class="form-label">
            {{ $t('ProfileView.BirthDateTitle') }}
          </label>
          <input
            v-model="birthDateValue"
            type="date"
            class="form-control"
            id="formDateBirth"
            @blur="birthDateBlur"
          />
          <span v-if="birthDateError" class="text-danger">{{ birthDateError }}</span>
        </div>
      </div>

      <FormTitle :titleText="$t('ProfileView.SectionContact')" :marginTop="true" />

      <div class="d-flex flex-wrap row g-3 align-items-center">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formHomePhone" class="form-label">
            {{ $t('ProfileView.HomePhoneTitle') }}
          </label>
          <input
            v-model="phoneHomeValue"
            type="text"
            class="form-control"
            id="formHomePhone"
            @blur="phoneHomeBlur"
          />
          <span v-if="phoneHomeError" class="text-danger">{{ phoneHomeError }}</span>
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formCellPhone" class="form-label">
            {{ $t('ProfileView.CellPhoneTitle') }}
          </label>
          <input
            v-model="phoneCellValue"
            type="text"
            class="form-control"
            id="formCellPhone"
            @blur="phoneCellBlur"
          />
          <span v-if="phoneCellError" class="text-danger">{{ phoneCellError }}</span>
        </div>
      </div>

      <FormTitle :titleText="$t('ProfileView.SectionAddress')" :marginTop="true" />

      <div class="d-flex flex-wrap row g-3 align-items-center">
        <div class="col-xl-6 col-md-6 col-sm-12 col-xs-12">
          <label for="formDirection" class="form-label">
            {{ $t('ProfileView.StreetTitle') }}
          </label>
          <input
            v-model="dirStreetValue"
            type="text"
            class="form-control"
            id="formDirection"
            @blur="dirStreetBlur"
          />
          <span v-if="dirStreetError" class="text-danger">{{ dirStreetError }}</span>
        </div>

        <div class="col-xl-2 col-md-6 col-sm-12 col-xs-12">
          <label for="formDirNumber" class="form-label">
            {{ $t('ProfileView.StreetNumTitle') }}
          </label>
          <input
            v-model="dirNumValue"
            type="text"
            class="form-control"
            id="formDirNumber"
            @blur="dirNumBlur"
          />
          <span v-if="dirNumError" class="text-danger">{{ dirNumError }}</span>
        </div>

        <div class="col-xl-2 col-md-6 col-sm-12 col-xs-12">
          <label for="formDirFloor" class="form-label">
            {{ $t('ProfileView.StreetFloorTitle') }}
          </label>
          <input
            v-model="dirFloorValue"
            type="text"
            class="form-control"
            id="formDirFloor"
            @blur="dirFloorBlur"
          />
          <span v-if="dirFloorError" class="text-danger">{{ dirFloorError }}</span>
        </div>

        <div class="col-xl-2 col-md-6 col-sm-12 col-xs-12">
          <label for="formDirDpto" class="form-label">
            {{ $t('ProfileView.StreetDeptTitle') }}
          </label>
          <input
            v-model="dirDptoValue"
            type="text"
            class="form-control"
            id="formDirDpto"
            @blur="dirDptoBlur"
          />
          <span v-if="dirDptoError" class="text-danger">{{ dirDptoError }}</span>
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formProvince" class="form-label">
            {{ $t('ProfileView.ProvinceTitle') }}
          </label>
          <select
            class="form-select"
            id="formProvince"
            v-model="provSelecValue"
            @blur="provSelecBlur"
          >
            <option value="0" selected>{{ $t('ProfileView.ProvinceSelect') }}</option>
            <option v-for="value in provinceList" :key="value.id" :value="value.id">
              {{ value.name }}
            </option>
          </select>
          <span v-if="provSelecError" class="text-danger">{{ provSelecError }}</span>
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12 position-relative">
          <label for="formLocality" class="form-label"> {{ $t('ProfileView.CityTitle') }} </label>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="locSelecValue"
              :placeholder="$t('ProfileView.CitySearchPlaceholder')"
              @blur="locSelecBlur"
            />
            <span v-if="isLoading" class="input-group-text">⏳</span>
          </div>
          <span v-if="locSelecError" class="text-danger">{{ locSelecError }}</span>

          <div
            v-if="localidadList.length > 0"
            class="list-group mt-1 position-absolute w-100 pe-3"
            style="z-index: 1000"
          >
            <button
              v-for="option in localidadList"
              :key="option.id"
              type="button"
              class="list-group-item list-group-item-action"
              @click="selectLocality(option)"
            >
              {{ option.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <button class="btn btn-outline-success" @click="saveChanges">
          <i class="bi bi-save"></i>
          {{ $t('GenericBtn.BtnSave') }}
        </button>
      </div>
    </form>

    <BtnBack :toHome="true" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { useField, useForm } from 'vee-validate';

import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getProfileDetail, saveProfileDetail } from '@/features/account/services/profile.action';
import {
  getDocTypesList,
  getLocalitiesList,
  getProvincesList,
} from '@/shared/services/generic.action';
import type { SaveProfileDetail } from '@/features/account/interfaces';
import { useAuthStore } from '@/shared/stores/auth.store';
import FormTitle from '@/shared/components/FormTitle.vue';
import InputGender from '@/shared/components/Inputs/InputGeneder.vue';

const configStore = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();
const settingStore = useSiteConfigStore();
const authStore = useAuthStore();

const profileDetails = reactive({
  email: undefined as string | undefined,
  gender: undefined as number | undefined,
  internalNum: undefined as number | undefined,
});

const localitySelected = ref<number>(0);
const provinceList = ref<{ id: number; name: string }[]>([]);
const localidadList = ref<{ id: number; name: string }[]>([]);
const docTypesList = ref<{ id: number; name: string }[]>([]);
const isLoading = ref(false);
const lastSelected = ref('');

onMounted(async () => {
  configStore.activeSpinner(t('ProfileView.LoadSpinMsg'));

  try {
    const docTypesDet = await getDocTypesList();
    const provDetail = await getProvincesList();
    const profDet = await getProfileDetail();

    if (
      profDet.ok &&
      profDet.data &&
      provDetail.ok &&
      provDetail.data &&
      docTypesDet.ok &&
      docTypesDet.data
    ) {
      provinceList.value = provDetail.data;
      docTypesList.value = docTypesDet.data;

      fullNameValue.value = profDet.data.fullName;
      profileDetails.email = profDet.data.email;
      profileDetails.gender = profDet.data.gender || undefined;
      docTypeValue.value = profDet.data.docType || 0;
      docNumValue.value = profDet.data.docNum || undefined;
      birthDateValue.value = profDet.data.dateBirth
        ? new Date(profDet.data.dateBirth).toISOString().split('T')[0]
        : null;
      profileDetails.internalNum = profDet.data.internalNum || undefined;

      dirStreetValue.value = profDet.data.direction || undefined;
      dirNumValue.value = profDet.data.dirNumber || undefined;
      dirFloorValue.value = profDet.data.dirFloor || undefined;
      dirDptoValue.value = profDet.data.dirDpto || undefined;
      locSelecValue.value = profDet.data.locality || undefined;
      localitySelected.value = profDet.data.localityId || 0;
      lastSelected.value = profDet.data.locality || '';
      provSelecValue.value = profDet.data.province || 0;

      phoneCellValue.value = profDet.data.cellPhone || undefined;
      phoneHomeValue.value = profDet.data.homePhone || undefined;
    } else {
      toast.error(t('ProfileView.LoadErrorMsg'));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  configStore.deactivateSpinner();
});

const selectLocality = async (option: { id: number; name: string }) => {
  locSelecValue.value = option.name;
  localitySelected.value = option.id;
  localidadList.value = [];
  lastSelected.value = option.name;
};

const profileFormEval = yup.object({
  fullName: yup.string().required().max(100, t('ValidationMsg.MaxLength').replace('{max}', '100')),
  gender: yup.number().required().min(1, t('ProfileView.GenderValidation')),
  docType: yup.number().required().min(1, t('ProfileView.DocTypeValidation')),
  docNumber: yup.string().required(),
  dateBirth: yup.date().required(),
  homePhone: yup.string().max(15, t('ValidationMsg.MaxLength').replace('{max}', '15')),
  cellPhone: yup.string().max(15, t('ValidationMsg.MaxLength').replace('{max}', '15')),
  direction: yup.string().required().max(100, t('ValidationMsg.MaxLength').replace('{max}', '100')),
  dirNumber: yup.number().required(),
  dirFloor: yup.number(),
  dirDpto: yup.number(),
  province: yup.number().required().min(1, t('ProfileView.ProvinceValidation')),
});

const { handleSubmit } = useForm({
  validationSchema: profileFormEval,
  initialValues: {
    fullName: undefined as string | undefined,
    gender: undefined as number | undefined,
    docType: undefined as number | undefined,
    docNumber: undefined as number | undefined,
    dateBirth: undefined as Date | undefined,
    cellPhone: undefined as string | undefined,
    homePhone: undefined as string | undefined,
    direction: undefined as string | undefined,
    dirNumber: undefined as number | undefined,
    dirFloor: undefined as number | undefined,
    dirDpto: undefined as number | undefined,
    province: undefined as number | undefined,
    locality: undefined as number | undefined,
  },
});

const {
  value: fullNameValue,
  errorMessage: fullNameError,
  handleBlur: fullNameBlur,
} = useField('fullName');

const {
  value: docTypeValue,
  errorMessage: docTypeError,
  handleBlur: docTypeBlur,
} = useField('docType');

const {
  value: docNumValue,
  errorMessage: docNumError,
  handleBlur: docNumBlur,
} = useField('docNumber');

const {
  value: birthDateValue,
  errorMessage: birthDateError,
  handleBlur: birthDateBlur,
} = useField('dateBirth');

const {
  value: phoneHomeValue,
  errorMessage: phoneHomeError,
  handleBlur: phoneHomeBlur,
} = useField('homePhone');

const {
  value: phoneCellValue,
  errorMessage: phoneCellError,
  handleBlur: phoneCellBlur,
} = useField('cellPhone');

const {
  value: dirStreetValue,
  errorMessage: dirStreetError,
  handleBlur: dirStreetBlur,
} = useField('direction');

const {
  value: dirNumValue,
  errorMessage: dirNumError,
  handleBlur: dirNumBlur,
} = useField('dirNumber');

const {
  value: dirFloorValue,
  errorMessage: dirFloorError,
  handleBlur: dirFloorBlur,
} = useField('dirFloor');

const {
  value: dirDptoValue,
  errorMessage: dirDptoError,
  handleBlur: dirDptoBlur,
} = useField('dirDpto');

const {
  value: provSelecValue,
  errorMessage: provSelecError,
  handleBlur: provSelecBlur,
} = useField('province');

const {
  value: locSelecValue,
  errorMessage: locSelecError,
  handleBlur: locSelecBlur,
} = useField('locality');

const saveChanges = handleSubmit(async (values) => {
  settingStore.activeSpinner(t('ProfileView.SaveSpinMsg'));

  try {
    const req: SaveProfileDetail = {
      fullName: values.fullName,
      gender: values.gender,
      docType: values.docType,
      docNum: values.docNumber,
      birthDate: values.dateBirth,
      homePhone: values.homePhone,
      cellPhone: values.cellPhone,
      direction: values.direction,
      dirNum: values.dirNumber,
      dirFloor: values.dirFloor,
      dirDpto: values.dirDpto,
      province: values.province,
      locality: localitySelected.value,
    };
    const serviceConfig = await saveProfileDetail(req);

    if (serviceConfig.ok) {
      toast.success(t('ProfileView.SaveSuccessMsg'));
      authStore.updateUserName(values.fullName as string);
    } else {
      toast.error(serviceConfig.message || t('ProfileView.SaveErrorMsg'));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  settingStore.deactivateSpinner();
});

watch(
  () => locSelecValue.value,
  async (newVal) => {
    isLoading.value = true;

    if (typeof newVal === 'string' && newVal.length > 4 && newVal !== lastSelected.value) {
      const { ok, data } = await getLocalitiesList(provSelecValue.value as number, newVal);

      if (ok && data) {
        localidadList.value = data;
      }
    } else {
      localidadList.value = [];
    }

    isLoading.value = false;
  },
  { immediate: true },
);
</script>
