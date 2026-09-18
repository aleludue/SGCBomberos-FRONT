<template>
  <div class="tab-pane fade show active" id="data-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column">
      <FormTitle :titleText="t('FormSections.BaseData')" />

      <div class="row mb-3">
        <FieldNumber
          :label-text="t('FormField.ActNumber')"
          v-model:num-val="intervDataDet.actNumber"
          field-name="actNumber"
          :is-required="true"
        />

        <FieldDate
          :label-text="t('FormField.IntervStart')"
          v-model:date-val="intervDataDet.startAt"
          :is-required="true"
          :max-date="new Date()"
          :include-time="true"
          field-name="startAt"
        />

        <FieldDate
          :label-text="t('FormField.IntervEnd')"
          v-model:date-val="intervDataDet.endAt"
          :min-date="intervDataDet.startAt"
          :max-date="new Date()"
          :include-time="true"
          field-name="endAt"
        />

        <FieldSelector
          :label-text="t('FormField.CommandChief')"
          :options-list="bombList"
          :is-required="true"
          v-model:option="intervDataDet.commandChiefId"
          field-name="commandChiefId"
        />
      </div>

      <FormTitle :titleText="t('FormSections.IntervDetails')" />

      <div class="row mb-3">
        <FieldText
          :label-text="t('FormField.Description')"
          field-name="description"
          :is-login-form="true"
          :is-textarea="true"
          :max-length="500"
          v-model:text-det="intervDataDet.description"
        />

        <FieldSelector
          :label-text="t('FormField.TypeSinisterCat')"
          :options-list="intervCatTypeList"
          :is-required="true"
          v-model:option="intervDataDet.intervCatTypeId"
          field-name="intervCatTypeId"
        />

        <FieldSelector
          :label-text="t('FormField.TypeSinister')"
          :options-list="intervTypeList"
          :is-required="true"
          v-model:option="intervDataDet.intervTypeId"
          field-name="intervTypeId"
        />

        <FieldText
          :label-text="t('FormField.OtherInfo')"
          field-name="informantExtraDetail"
          :is-login-form="true"
          :is-textarea="true"
          :max-length="255"
          v-model:text-det="intervDataDet.informantExtraDetail"
        />
      </div>

      <FormTitle :titleText="t('FormSections.NotifyDetails')" />

      <div class="row mb-3">
        <FieldSelector
          :label-text="t('FormField.NotificationBy')"
          :options-list="notifMethodList"
          :is-required="true"
          v-model:option="intervDataDet.notificationMethodId"
          field-name="notificationMethodId"
        />

        <FieldSelector
          :label-text="t('FormField.ReceivedBy')"
          :options-list="notifRecipList"
          :is-required="true"
          v-model:option="intervDataDet.notificationRecipId"
          field-name="notificationRecipId"
        />

        <FieldDate
          :label-text="t('FormField.CallTime')"
          v-model:date-val="intervDataDet.informantCallTime"
          :max-date="new Date()"
          :include-time="true"
          field-name="informantCallTime"
        />

        <FieldText
          :label-text="t('FormField.FullName')"
          field-name="informantName"
          :max-length="100"
          :is-required="true"
          v-model:text-det="intervDataDet.informantName"
        />

        <FieldNumber
          :label-text="t('FormField.Document')"
          v-model:num-val="intervDataDet.informantDocument"
          field-name="informantDocument"
          :max-length="20"
        />

        <FieldPhone
          :label-text="t('FormField.Phone')"
          field-name="informantPhone"
          v-model:phone-val="intervDataDet.informantPhone"
        />
      </div>

      <FormTitle :titleText="t('FormSections.LocationDetails')" />

      <div class="row mb-3">
        <FieldSelector
          :label-text="t('FormField.Province')"
          :options-list="provinceList"
          :is-required="true"
          v-model:option="intervDataDet.provinceId"
          field-name="provinceId"
        />

        <FieldSelector
          :label-text="t('FormField.City')"
          :options-list="localityList"
          :is-required="true"
          v-model:option="intervDataDet.localityId"
          field-name="localityId"
        />

        <FieldText
          :label-text="t('FormField.Direction')"
          field-name="address"
          :max-length="150"
          :is-required="true"
          v-model:text-det="intervDataDet.address"
        />

        <FieldText
          :label-text="t('FormField.OtherInfo')"
          field-name="addressExtraDetail"
          :max-length="255"
          :is-login-form="true"
          :is-textarea="true"
          v-model:text-det="intervDataDet.addressExtraDetail"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

import FormTitle from '@/shared/components/FormTitle.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldPhone from '@/shared/components/Inputs/FieldPhone.vue';

import {
  getIntervNotifMethods,
  getIntervTypes,
} from '@/features/interventions/services/interventions.action';
import type {
  IntervDataDet,
  IntervTypeData,
} from '@/features/interventions/interfaces/interventions.interfaces';
import { getLocalitiesList, getProvincesList } from '@/shared/services/generic.action';

const toast = useToast();
const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    bombList: { id: string; name: string }[];
    initialData?: Partial<IntervDataDet> | null;
  }>(),
  {
    bombList: () => [],
  },
);

const notifMethodList = ref<{ id: string; name: string }[]>([]);
const provinceList = ref<{ id: string; name: string }[]>([]);
const localityList = ref<{ id: string; name: string }[]>([]);
const intervCatTypeList = ref<{ id: number; name: string }[]>([]);
const intervTypeList = ref<{ id: string; name: string }[]>([]);

const typesCatDetail = ref<{ types: IntervTypeData[]; classifId: number }[]>([]);
const notifRecipList = ref<{ id: number; name: string }[]>([
  { id: 1, name: 'Tel. 100' },
  { id: 2, name: 'Tel. 400000' },
  { id: 3, name: 'Tel. 401000' },
]);

const intervDataDet = reactive<IntervDataDet>({
  actNumber: 0,
  startAt: undefined as Date | undefined,
  endAt: undefined as Date | undefined,
  description: '',
  informantName: '',
  informantDocument: 0,
  informantPhone: '',
  informantCallTime: undefined as Date | undefined,
  informantExtraDetail: '',
  notificationMethodId: 0,
  notificationRecipId: 0,
  address: '',
  addressExtraDetail: '',
  localityId: '',
  provinceId: '',
  intervTypeId: '',
  intervCatTypeId: 0,
  commandChiefId: '',
});

onMounted(async () => {
  const [notfMetDet, typesDetail, provDetail] = await Promise.all([
    getIntervNotifMethods(),
    getIntervTypes(),
    getProvincesList(),
  ]);

  if (
    typesDetail.ok &&
    typesDetail.data &&
    notfMetDet.ok &&
    notfMetDet.data &&
    provDetail.ok &&
    provDetail.data
  ) {
    notifMethodList.value = notfMetDet.data;
    provinceList.value = provDetail.data;

    let catId = 1;
    typesDetail.data.forEach((type) => {
      intervCatTypeList.value.push({ id: catId, name: type.classifName });
      typesCatDetail.value.push({ types: type.types, classifId: catId });
      catId++;
    });
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }
});

watch(
  () => props.initialData,
  (newData) => {
    if (!newData) return;

    Object.assign(intervDataDet, newData);
  },
  { deep: true, immediate: true },
);

watch(
  () => intervDataDet.intervCatTypeId,
  async (newVal) => {
    if (newVal > 0) {
      const catDetail = typesCatDetail.value.find((cat) => cat.classifId === newVal);
      if (catDetail) {
        intervTypeList.value = catDetail.types.map((type) => ({ id: type.id, name: type.name }));
      }
    } else {
      intervTypeList.value = [];
      intervDataDet.intervTypeId = '';
    }
  },
  { immediate: true },
);

watch(
  () => intervDataDet.provinceId,
  async (newVal, oldVal) => {
    if (newVal === oldVal) return;

    localityList.value = [];
    intervDataDet.localityId = '';

    if (!newVal) return;

    const { ok, data } = await getLocalitiesList(intervDataDet.provinceId);

    if (ok && data) {
      localityList.value = data;
    }
  },
  { immediate: true },
);
</script>
