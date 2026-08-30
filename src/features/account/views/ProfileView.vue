<template>
  <div class="container">
    <SectionTitle
      :title="$t('BaseViews.ProfileTitle')"
      :subtitle="$t('BaseViews.ProfileSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('BaseViews.ProfileTitle') }]"
    />

    <div class="d-flex flex-column">
      <form @submit.prevent="saveChanges">
        <FormTitle :titleText="$t('FormSections.BaseData')" />
        <div class="row mb-3">
          <FieldText
            :label-text="$t('FormField.FullName')"
            field-name="fullName"
            :is-required="true"
            :max-length="100"
            v-model:text-det="profileDetails.fullName"
          />
          <FieldSelector
            :label-text="$t('FormField.Gender')"
            :options-list="genderOptions"
            :is-required="true"
            v-model:option="profileDetails.gender"
            field-name="gender"
          />
          <FieldReadOnly :labelText="$t('FormField.Email')" :valueText="profileDetails.email" />
          <FieldReadOnly
            :labelText="$t('FormField.InternalNum')"
            :valueText="profileDetails.internalNum?.toString()"
          />
          <FieldSelector
            :label-text="$t('FormField.DocumentType')"
            :readonly="false"
            :options-list="docTypesList"
            :is-required="true"
            v-model:option="profileDetails.docType"
            field-name="docType"
          />

          <FieldNumber
            :label-text="$t('FormField.DocumentNum')"
            v-model:num-val="profileDetails.docNum"
            field-name="docNumber"
            :is-required="true"
          />

          <FieldDate
            :label-text="$t('FormField.BirthDate')"
            v-model:date-val="profileDetails.dateBirth"
            :is-required="true"
            :min-date="new Date(new Date().setFullYear(new Date().getFullYear() - 100))"
            :max-date="new Date()"
            field-name="dateBirth"
          />
        </div>

        <FormTitle :titleText="$t('FormSections.InstitConfig')" />
        <div class="row mb-3">
          <FieldSelector
            :label-text="$t('FormField.Institution')"
            v-model:option="profileDetails.institution"
            :readonly="true"
            :options-list="institutionList"
            field-name="institution"
          />

          <FieldSelector
            v-if="!profileDetails.institution"
            :label-text="$t('FormField.InstitutionProposed')"
            v-model:option="profileDetails.institutionProposed"
            :readonly="false"
            :options-list="institutionList"
            field-name="institutionProposed"
          />
        </div>

        <FormTitle :titleText="$t('FormSections.Contact')" />
        <div class="row mb-3">
          <FieldPhone
            :label-text="$t('FormField.CellPhone')"
            :phone-val="profileDetails.cellPhone"
            :is-required="true"
            field-name="cellPhone"
          />

          <FieldPhone
            :label-text="$t('FormField.HomePhone')"
            :phone-val="profileDetails.homePhone"
            field-name="homePhone"
          />
        </div>

        <FormTitle :titleText="$t('FormSections.Address')" />
        <div class="row mb-3">
          <FieldSelector
            :label-text="$t('FormField.Province')"
            v-model:option="profileDetails.province"
            :readonly="false"
            :options-list="provinceList"
            field-name="province"
          />

          <FieldSelector
            :label-text="$t('FormField.City')"
            v-model:option="localitySelected"
            :readonly="false"
            :options-list="localidadList"
            field-name="locality"
          />

          <FieldText
            :label-text="$t('FormField.Street')"
            field-name="direction"
            :is-required="true"
            :max-length="100"
            v-model:text-det="profileDetails.direction"
          />

          <FieldNumber
            :label-text="$t('FormField.StreetNum')"
            v-model:num-val="profileDetails.dirNumber"
            field-name="dirNum"
            :is-required="true"
          />

          <FieldNumber
            :label-text="$t('FormField.StreetFloor')"
            v-model:num-val="profileDetails.dirFloor"
            field-name="dirFloor"
          />

          <FieldText
            :label-text="$t('FormField.StreetDept')"
            field-name="dirDpto"
            :is-required="false"
            :max-length="10"
            v-model:text-det="profileDetails.dirDpto"
          />
        </div>

        <div class="d-flex mt-3 mb-0 w-100 btn-responsive-wrapper">
          <BtnConfirm type="submit" size="sm" :text-detail="$t('Buttons.Save')" />
        </div>
      </form>

      <BtnBack :toHome="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import { useAuthStore } from '@/shared/stores/auth.store';
import { getProfileDetail, saveProfileDetail } from '@/features/account/services/profile.action';
import {
  getDocTypesList,
  getLocalitiesList,
  getProvincesList,
} from '@/shared/services/generic.action';
import { genericOptionsList } from '@/shared/composables/genericOptionList';

import SectionTitle from '@/shared/components/SectionTitle.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldPhone from '@/shared/components/Inputs/FieldPhone.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import { getInstitutions } from '@/features/institution/services/institution.action';

const toast = useToast();
const { t } = useI18n();
const authStore = useAuthStore();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { handleSubmit, resetForm } = useForm();

const profileDetails = reactive({
  fullName: '',
  email: '',
  gender: 0,
  internalNum: 0,
  docType: 0,
  docNum: 0,
  dateBirth: undefined as Date | undefined,
  cellPhone: '',
  homePhone: '',
  province: 0,
  locality: 0,
  direction: '',
  dirNumber: undefined as number | undefined,
  dirFloor: undefined as number | undefined,
  dirDpto: '',
  institution: 0,
  institutionProposed: 0,
});

const localitySelected = ref(0);
const provinceList = ref<{ id: number; name: string }[]>([]);
const localidadList = ref<{ id: number; name: string }[]>([]);
const docTypesList = ref<{ id: number; name: string }[]>([]);
const institutionList = ref<{ id: number; name: string }[]>([]);
const genderOptions = genericOptionsList().genderList;

onMounted(async () => {
  const [docTypesDet, provDetail, instDetail] = await Promise.all([
    getDocTypesList(),
    getProvincesList(),
    getInstitutions(),
  ]);

  if (
    provDetail.ok &&
    provDetail.data &&
    docTypesDet.ok &&
    docTypesDet.data &&
    instDetail.ok &&
    instDetail.data
  ) {
    provinceList.value = provDetail.data;
    docTypesList.value = docTypesDet.data;
    institutionList.value = instDetail.data;

    await loadProfile();
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }

  desactivateSpinner();
});

const loadProfile = async () => {
  const profDet = await getProfileDetail();

  if (profDet.ok && profDet.data) {
    profileDetails.province = profDet.data.province ?? 0;
    Object.assign(profileDetails, profDet.data);
    resetForm({ values: { ...profDet.data } });
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }
};

const saveChanges = handleSubmit(async (values) => {
  activeSpinner(t('Messages.Update'));

  const req = {
    ...values,
    docNum: values.docNumber,
    birthDay: values.dateBirth,
  };

  const serviceConfig = await saveProfileDetail(req);

  if (serviceConfig.ok) {
    toast.success(serviceConfig.message);
    authStore.updateUserName(values.fullName as string);
  } else {
    toast.error(serviceConfig.message ?? t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});

watch(
  () => profileDetails.province,
  async (newVal, oldVal) => {
    if (newVal === oldVal) return;

    if (!newVal) {
      localidadList.value = [];
      return;
    }
    const { ok, data } = await getLocalitiesList(profileDetails.province);
    localidadList.value = [];
    localitySelected.value = 0;
    if (ok && data) {
      localidadList.value = data;

      if (oldVal === 0) {
        localitySelected.value = profileDetails.locality ?? 0;
      }
    }
  },
);
</script>
