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
            :label-text="$t('FormField.Name')"
            field-name="name"
            :is-required="true"
            :max-length="100"
            v-model:text-det="institutionDetails.name"
          />
        </div>

        <FormTitle :titleText="$t('FormSections.Address')" />
        <div class="row mb-3">
          <FieldSelector
            :label-text="$t('FormField.Province')"
            v-model:option="institutionDetails.province"
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
            v-model:text-det="institutionDetails.direction"
          />
          <FieldNumber
            :label-text="$t('FormField.StreetNum')"
            v-model:num-val="institutionDetails.dirNumber"
            field-name="dirNum"
            :is-required="true"
          />
          <FieldNumber
            :label-text="$t('FormField.StreetFloor')"
            v-model:num-val="institutionDetails.dirFloor"
            field-name="dirFloor"
          />
          <FieldText
            :label-text="$t('FormField.StreetDept')"
            field-name="dirDpto"
            :is-required="false"
            :max-length="10"
            v-model:text-det="institutionDetails.dirDpto"
          />
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
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getLocalitiesList, getProvincesList } from '@/shared/services/generic.action';

import { getInstitution } from '@/features/institution/services/institution.action';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();

const institutionDetails = reactive({
  name: '',
  direction: '',
  dirNumber: undefined as number | undefined,
  dirFloor: undefined as number | undefined,
  dirDpto: '',
  locality: 0,
  province: 0,
});

const localitySelected = ref(0);
const provinceList = ref<{ id: number; name: string }[]>([]);
const localidadList = ref<{ id: number; name: string }[]>([]);
const { handleSubmit, resetForm } = useForm();

onMounted(async () => {
  const provDetail = await getProvincesList();
  const instDetail = await getInstitution();

  if (provDetail.ok && provDetail.data && instDetail.ok && instDetail.data) {
    provinceList.value = provDetail.data;
    Object.assign(institutionDetails, instDetail.data);
    resetForm();
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }

  desactivateSpinner();
});

const saveChanges = handleSubmit(async () => {
  activeSpinner(t('Messages.Update'));

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
