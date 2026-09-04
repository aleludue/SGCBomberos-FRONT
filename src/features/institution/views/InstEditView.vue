<template>
  <div class="container">
    <SectionTitle
      :title="t('InstitutionViews.ManageTitle')"
      :subtitle="t('InstitutionViews.ManageSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('InstitutionViews.MenuTitle'), link: '/institution' },
        { detail: t('InstitutionViews.ManageTitle') },
      ]"
    />

    <div class="d-flex flex-column">
      <form @submit.prevent="saveChanges">
        <FormTitle :titleText="$t('FormSections.BaseData')" />
        <div class="row mb-3">
          <FieldText
            :label-text="$t('FormField.SocialReason')"
            field-name="socialReason"
            :is-required="true"
            :max-length="150"
            v-model:text-det="institutionDetails.socialReason"
          />

          <FieldText
            :label-text="$t('FormField.Cuit')"
            field-name="cuit"
            :is-required="true"
            :max-length="11"
            :only-number="true"
            v-model:text-det="institutionDetails.cuit"
          />

          <FieldDate
            :label-text="$t('FormField.FoundationDate')"
            v-model:date-val="institutionDetails.foundationDate"
            :is-required="true"
            :max-date="new Date()"
            field-name="foundationDate"
          />

          <FieldNumber
            :label-text="$t('FormField.RegionalNumber')"
            v-model:num-val="institutionDetails.regionalNumber"
            :is-required="true"
            field-name="regionalNumber"
          />

          <FieldNumber
            :label-text="$t('FormField.QuarterNumber')"
            v-model:num-val="institutionDetails.quarterNumber"
            :is-required="true"
            field-name="quarterNumber"
          />

          <FieldText
            :label-text="$t('FormField.IpjRegisterNumber')"
            field-name="ipjMatricula"
            :max-length="150"
            v-model:text-det="institutionDetails.ipjMatricula"
          />

          <FieldSelector
            :label-text="$t('FormField.RankSystem')"
            v-model:option="institutionDetails.rankSystem"
            :options-list="rankSistList"
            :is-required="true"
            field-name="rankSystem"
          />
        </div>

        <FormAlert class="mb-3" :text-detail="t('Messages.RankSystemChange')" />

        <FormTitle :titleText="$t('FormSections.Contact')" />
        <div class="row mb-3">
          <FieldEmail
            v-model:email="institutionDetails.email"
            :label-text="$t('FormField.Email')"
            :is-login-form="false"
            field-name="email"
          />

          <FieldPhone
            :label-text="$t('FormField.EmergencyPhone')"
            :phone-val="institutionDetails.emergencyPhone"
            :is-required="true"
            field-name="emergencyPhone"
          />

          <FieldPhone
            :label-text="$t('FormField.AdminPhone')"
            :phone-val="institutionDetails.adminPhone"
            field-name="adminPhone"
          />
        </div>

        <FormTitle :titleText="$t('FormSections.Address')" />
        <div class="row mb-3">
          <FieldSelector
            :label-text="$t('FormField.Province')"
            v-model:option="institutionDetails.province"
            :options-list="provinceList"
            field-name="province"
          />

          <FieldSelector
            :label-text="$t('FormField.City')"
            v-model:option="localitySelected"
            :options-list="localidadList"
            :is-required="true"
            field-name="locality"
          />

          <FieldText
            :label-text="$t('FormField.Street')"
            field-name="direction"
            :is-required="true"
            :max-length="100"
            v-model:text-det="institutionDetails.direction"
          />

          <FieldNumber
            :label-text="$t('FormField.StreetNum')"
            v-model:num-val="institutionDetails.dirNumber"
            field-name="dirNumber"
          />

          <FieldNumber
            :label-text="$t('FormField.StreetFloor')"
            v-model:num-val="institutionDetails.dirFloor"
            field-name="dirFloor"
          />

          <FieldText
            :label-text="$t('FormField.StreetDept')"
            field-name="dirDpto"
            :max-length="10"
            v-model:text-det="institutionDetails.dirDpto"
          />
        </div>

        <div class="d-flex mt-3 mb-0 w-100 btn-responsive-wrapper">
          <BtnConfirm type="submit" size="sm" :text-detail="$t('Buttons.Save')" />
        </div>
      </form>
    </div>

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldPhone from '@/shared/components/Inputs/FieldPhone.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldEmail from '@/shared/components/Inputs/FieldEmail.vue';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getLocalitiesList, getProvincesList } from '@/shared/services/generic.action';

import {
  getInstitution,
  getRankSystems,
  saveInstitution,
} from '@/features/institution/services/institution.action';
import type { InstitutionData } from '@/features/institution/interfaces/institution.interfaces';
import FormAlert from '@/shared/components/FormAlert.vue';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();

const institutionDetails = reactive({
  socialReason: '',
  direction: '',
  dirNumber: undefined as number | undefined,
  dirFloor: undefined as number | undefined,
  dirDpto: '',
  locality: 0,
  province: 0,
  cuit: '',
  ipjMatricula: '',
  quarterNumber: 0,
  regionalNumber: 0,
  foundationDate: undefined as Date | undefined,
  emergencyPhone: '',
  adminPhone: '',
  email: '',
  rankSystem: 0,
});

const localitySelected = ref(0);
const provinceList = ref<{ id: number; name: string }[]>([]);
const localidadList = ref<{ id: number; name: string }[]>([]);
const rankSistList = ref<{ id: number; name: string }[]>([]);

const { handleSubmit, resetForm } = useForm();

onMounted(async () => {
  const [provDetail, rankSistDet] = await Promise.all([getProvincesList(), getRankSystems()]);

  if (provDetail.ok && provDetail.data && rankSistDet.ok && rankSistDet.data) {
    provinceList.value = provDetail.data;
    rankSistList.value = rankSistDet.data;

    await loadInstData();
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }

  desactivateSpinner();
});

const loadInstData = async () => {
  const instDetail = await getInstitution();

  if (instDetail.ok && instDetail.data) {
    Object.assign(institutionDetails, instDetail.data);
    resetForm();
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }
};

const saveChanges = handleSubmit(async (values) => {
  activeSpinner(t('Messages.Update'));

  const req: InstitutionData = {
    socialReason: values.socialReason,
    cuit: values.cuit,
    foundationDate: new Date(values.foundationDate),
    regionalNumber: values.regionalNumber,
    quarterNumber: values.quarterNumber,
    ipjMatricula: values.ipjMatricula,
    rankSystem: values.rankSystem,
    email: values.email,
    emergencyPhone: values.emergencyPhone,
    adminPhone: values.adminPhone,
    locality: values.locality,
    direction: values.direction,
    dirNumber: values.dirNumber,
    dirFloor: values.dirFloor,
    dirDpto: values.dirDpto,
  };

  const updDataInst = await saveInstitution(req);

  if (updDataInst.ok) {
    toast.success(updDataInst.message);
  } else {
    toast.error(updDataInst.message ?? t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});

watch(
  () => institutionDetails.province,
  async (newVal, oldVal) => {
    if (newVal === oldVal) return;

    if (!newVal) {
      localidadList.value = [];
      return;
    }
    const { ok, data } = await getLocalitiesList(institutionDetails.province);
    localidadList.value = [];
    localitySelected.value = 0;
    if (ok && data) {
      localidadList.value = data;

      if (oldVal === 0) {
        localitySelected.value = institutionDetails.locality ?? 0;
      }
    }
  },
);
</script>
