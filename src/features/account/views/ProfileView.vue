<template>
  <title>{{ $t('ProfileView.ViewTitle') }}</title>

  <div class="container">
    <SectionTitle
      :title="$t('ProfileView.Title')"
      :subtitle="$t('ProfileView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('ProfileView.Title') }]"
    />

    <form
      @submit.prevent="saveChanges"
      class="d-flex flex-column mt-2 p-3 border rounded shadow gap-2"
    >
      <FormTitle :titleText="$t('ProfileView.SectionBaseData')" />

      <div class="d-flex flex-wrap row g-3 align-items-top">
        <FieldText
          :label-text="$t('ProfileView.FullNameTitle')"
          :field-name="'fullName'"
          :is-required="true"
          :max-length="100"
          v-model:text-det="profileDetails.fullName"
        />

        <FieldSelector
          :label-text="$t('ProfileView.GenderTitle')"
          :readonly="false"
          :options-list="genderOptions"
          :is-required="true"
          v-model:option="profileDetails.gender"
          field-name="gender"
        />

        <FieldReadOnly
          :labelText="$t('ProfileView.EmailTitle')"
          :valueText="profileDetails.email"
          :form-style="true"
        />

        <FieldReadOnly
          :labelText="$t('ProfileView.InternalNumTitle')"
          :valueText="profileDetails.internalNum?.toString()"
          :form-style="true"
        />

        <FieldSelector
          :label-text="$t('ProfileView.DocTypeTitle')"
          :readonly="false"
          :options-list="docTypesList"
          :is-required="true"
          v-model:option="profileDetails.docType"
          field-name="docType"
        />

        <FieldText
          :label-text="$t('ProfileView.DocumentNumTitle')"
          :field-name="'docNumber'"
          :is-required="true"
          v-model:text-det="profileDetails.docNum"
        />

        <FieldDate
          :label-text="$t('ProfileView.BirthDateTitle')"
          :date-val="profileDetails.dateBirth"
          :is-required="true"
          :min-date="new Date(new Date().setFullYear(new Date().getFullYear() - 100))"
          :max-date="new Date()"
          field-name="dateBirth"
        />
      </div>

      <FormTitle :titleText="$t('ProfileView.SectionContact')" :marginTop="true" />

      <div class="d-flex flex-wrap row g-3 align-items-top">
        <FieldPhone
          :label-text="$t('ProfileView.CellPhoneTitle')"
          :phone-val="profileDetails.cellPhone"
          :is-required="true"
          field-name="cellPhone"
        />

        <FieldPhone
          :label-text="$t('ProfileView.HomePhoneTitle')"
          :phone-val="profileDetails.homePhone"
          field-name="homePhone"
        />
      </div>

      <FormTitle :titleText="$t('ProfileView.SectionAddress')" :marginTop="true" />

      <div class="d-flex flex-wrap row g-3 align-items-top">
        <FieldSelector
          :label-text="$t('ProfileView.ProvinceTitle')"
          v-model:option="profileDetails.province"
          :readonly="false"
          :options-list="provinceList"
          :error-text="$t('ProfileView.ProvinceValidation')"
          field-name="province"
        />

        <FieldSearch
          :label-text="$t('ProfileView.CityTitle')"
          :is-required="true"
          v-model:id-selected="localitySelected"
          v-model:text-detail="profileDetails.locality"
          v-model:result-list="localidadList"
          v-model:last-selected="lastSelected"
          fieldName="locality"
        />

        <FieldText
          :label-text="$t('ProfileView.StreetTitle')"
          :field-name="'direction'"
          :is-required="true"
          :max-length="100"
          v-model:text-det="profileDetails.dirStreet"
        />

        <FieldNumber
          :label-text="$t('ProfileView.StreetNumTitle')"
          :num-val="profileDetails.dirNumber"
          field-name="dirNumber"
          :is-required="true"
        />

        <FieldNumber
          :label-text="$t('ProfileView.StreetFloorTitle')"
          :num-val="profileDetails.dirFloor"
          field-name="dirFloor"
        />

        <FieldNumber
          :label-text="$t('ProfileView.StreetDeptTitle')"
          :num-val="profileDetails.dirDpto"
          field-name="dirDpto"
        />
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
import { onMounted, nextTick, reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';

import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import type { SaveProfileDetail } from '@/features/account/interfaces';
import { useAuthStore } from '@/shared/stores/auth.store';
import FormTitle from '@/shared/components/FormTitle.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import { genericOptionsList } from '@/shared/composables/genericOptionList';
import { getProfileDetail, saveProfileDetail } from '@/features/account/services/profile.action';
import {
  getDocTypesList,
  getLocalitiesList,
  getProvincesList,
} from '@/shared/services/generic.action';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldPhone from '@/shared/components/Inputs/FieldPhone.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import FieldSearch from '@/shared/components/Inputs/FieldSearch.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';

const toast = useToast();
const { t } = useI18n();
const settingStore = useSiteConfigStore();
const authStore = useAuthStore();

const profileDetails = reactive({
  email: undefined as string | undefined,
  gender: undefined as number | undefined,
  internalNum: undefined as number | undefined,
  docType: undefined as number | undefined,
  province: undefined as number | undefined,
  dirNumber: undefined as number | undefined,
  dirFloor: undefined as number | undefined,
  dirDpto: undefined as number | undefined,
  homePhone: undefined as string | undefined,
  cellPhone: undefined as string | undefined,
  dateBirth: undefined as Date | undefined,
  locality: '' as string,
  fullName: undefined as string | undefined,
  dirStreet: undefined as string | undefined,
  docNum: undefined as string | undefined,
});

const localitySelected = ref<number>(0);
const provinceList = ref<{ id: number; name: string }[]>([]);
const localidadList = ref<{ id: number; name: string }[]>([]);
const docTypesList = ref<{ id: number; name: string }[]>([]);
const isLoading = ref(false);
const lastSelected = ref('');
const genderOptions = genericOptionsList().genderList;

onMounted(async () => {
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
      profileDetails.province = profDet.data.province || 0;
      await nextTick();

      docTypesList.value = docTypesDet.data;
      profileDetails.fullName = profDet.data.fullName;
      profileDetails.email = profDet.data.email;
      profileDetails.gender = profDet.data.gender || 0;
      profileDetails.docType = profDet.data.docType || 0;
      profileDetails.docNum = profDet.data.docNum || undefined;
      profileDetails.dateBirth = profDet.data.dateBirth || undefined;
      profileDetails.internalNum = profDet.data.internalNum || undefined;

      profileDetails.dirStreet = profDet.data.direction || undefined;
      profileDetails.dirNumber = profDet.data.dirNumber || undefined;
      profileDetails.dirFloor = profDet.data.dirFloor || undefined;
      profileDetails.dirDpto = profDet.data.dirDpto || undefined;
      localitySelected.value = profDet.data.localityId || 0;
      profileDetails.locality = profDet.data.locality || '';
      lastSelected.value = profDet.data.locality || '';

      profileDetails.cellPhone = profDet.data.cellPhone || undefined;
      profileDetails.homePhone = profDet.data.homePhone || undefined;
    } else {
      toast.error(t('ProfileView.LoadErrorMsg'));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }
});

const { handleSubmit, values } = useForm({
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

const saveChanges = handleSubmit(async () => {
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
  () => profileDetails.locality,
  async (newVal) => {
    isLoading.value = true;

    if (typeof newVal === 'string' && newVal.length > 4 && newVal !== lastSelected.value) {
      const { ok, data } = await getLocalitiesList(values.province as number, newVal);

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

watch(
  () => values.province,
  async () => {
    profileDetails.locality = '';
    localitySelected.value = 0;
    lastSelected.value = '';
    localidadList.value = [];
  },
);
</script>
