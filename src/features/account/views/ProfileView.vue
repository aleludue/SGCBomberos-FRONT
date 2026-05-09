<template>
  <div class="container">
    <SectionTitle
      :title="$t('ProfileView.Title')"
      :subtitle="$t('ProfileView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('ProfileView.Title') }]"
    />

    <form
      @submit.prevent="saveChanges"
      class="d-flex flex-column mt-2 p-3 border rounded shadow gap-2 bg-body-tertiary"
    >
      <FormTitle :titleText="$t('ProfileView.SectionBaseData')" />

      <div class="row g-3">
        <FieldText
          :label-text="$t('ProfileView.FullNameTitle')"
          field-name="fullName"
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
          field-name="docNumber"
          :is-required="true"
          :text-det="String(profileDetails.docNum)"
        />

        <FieldDate
          :label-text="$t('ProfileView.BirthDateTitle')"
          v-model:date-val="profileDetails.dateBirth"
          :is-required="true"
          :min-date="new Date(new Date().setFullYear(new Date().getFullYear() - 100))"
          :max-date="new Date()"
          field-name="dateBirth"
        />
      </div>

      <FormTitle :titleText="$t('ProfileView.SectionContact')" :marginTop="true" />

      <div class="row g-3">
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

      <div class="row g-3">
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
          field-name="direction"
          :is-required="true"
          :max-length="100"
          v-model:text-det="profileDetails.direction"
        />

        <FieldNumber
          :label-text="$t('ProfileView.StreetNumTitle')"
          :num-val="profileDetails.dirNumber"
          field-name="dirNum"
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
        <button type="submit" class="btn btn-success px-5">
          <i class="bi bi-save me-2"></i>
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

// Stores & Services
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { useAuthStore } from '@/shared/stores/auth.store';
import { getProfileDetail, saveProfileDetail } from '@/features/account/services/profile.action';
import {
  getDocTypesList,
  getLocalitiesList,
  getProvincesList,
} from '@/shared/services/generic.action';
import { genericOptionsList } from '@/shared/composables/genericOptionList';

// Components
import SectionTitle from '@/shared/components/SectionTitle.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import BtnBack from '@/shared/components/BtnBack.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldPhone from '@/shared/components/Inputs/FieldPhone.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import FieldSearch from '@/shared/components/Inputs/FieldSearch.vue';

const toast = useToast();
const { t } = useI18n();
const settingStore = useSiteConfigStore();
const authStore = useAuthStore();

const profileDetails = reactive({
  fullName: '',
  email: '',
  gender: 0,
  internalNum: 0,
  docType: 0,
  docNum: '',
  dateBirth: undefined as Date | undefined,
  cellPhone: '',
  homePhone: '',
  province: 0,
  locality: '',
  direction: '',
  dirNumber: undefined as number | undefined,
  dirFloor: undefined as number | undefined,
  dirDpto: undefined as number | undefined,
});

const localitySelected = ref(0);
const lastSelected = ref('');
const provinceList = ref<{ id: number; name: string }[]>([]);
const localidadList = ref<{ id: number; name: string }[]>([]);
const docTypesList = ref<{ id: number; name: string }[]>([]);
const genderOptions = genericOptionsList().genderList;

const { handleSubmit, resetForm } = useForm();

onMounted(async () => {
  try {
    const [docTypesDet, provDetail, profDet] = await Promise.all([
      getDocTypesList(),
      getProvincesList(),
      getProfileDetail(),
    ]);

    if (
      profDet.ok &&
      profDet.data &&
      provDetail.ok &&
      provDetail.data &&
      docTypesDet.ok &&
      docTypesDet.data
    ) {
      provinceList.value = provDetail.data;
      profileDetails.province = profDet.data.province ?? 0;
      docTypesList.value = docTypesDet.data;

      await nextTick();

      localitySelected.value = profDet.data.localityId ?? 0;
      lastSelected.value = profDet.data.locality ?? '';
      Object.assign(profileDetails, profDet.data);

      resetForm({ values: { ...profDet.data } });
    } else {
      toast.error(t('ProfileView.LoadErrorMsg'));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }
});

const saveChanges = handleSubmit(async (values) => {
  settingStore.activeSpinner(t('ProfileView.SaveSpinMsg'));

  try {
    const req = {
      ...values,
      docNum: values.docNumber,
      birthDate: values.dateBirth,
      locality: localitySelected.value,
    };
    const serviceConfig = await saveProfileDetail(req);

    if (serviceConfig.ok) {
      toast.success(t('ProfileView.SaveSuccessMsg'));
      authStore.updateUserName(values.fullName as string);
    } else {
      toast.error(serviceConfig.message ?? t('ProfileView.SaveErrorMsg'));
    }
  } catch (error) {
    toast.error((error as Error).message);
  } finally {
    settingStore.deactivateSpinner();
  }
});

watch(
  () => profileDetails.locality,
  async (newVal) => {
    if (!newVal || newVal === lastSelected.value || newVal.length < 3) {
      if (!newVal) localidadList.value = [];
      return;
    }

    const { ok, data } = await getLocalitiesList(profileDetails.province, newVal);
    if (ok && data) {
      localidadList.value = data;
    }
  },
);

watch(
  () => profileDetails.province,
  () => {
    profileDetails.locality = '';
    localitySelected.value = 0;
    lastSelected.value = '';
    localidadList.value = [];
  },
);
</script>
