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
          :readonly="!props.isEdit"
        />

        <FieldDate
          :label-text="t('FormField.IntervStart')"
          v-model:date-val="intervDataDet.startAt"
          :is-required="true"
          :max-date="new Date()"
          :include-time="true"
          field-name="startAt"
          :readonly="!props.isEdit"
        />

        <FieldDate
          v-if="props.isEdit || intervDataDet.startAt"
          :label-text="t('FormField.IntervEnd')"
          v-model:date-val="intervDataDet.endAt"
          :min-date="intervDataDet.startAt"
          :max-date="new Date()"
          :include-time="true"
          field-name="endAt"
          :readonly="!props.isEdit"
        />

        <FieldSelector
          :label-text="t('FormField.CommandChief')"
          :options-list="bombList"
          :is-required="true"
          v-model:option="intervDataDet.commandChiefId"
          field-name="commandChiefId"
          :readonly="!props.isEdit"
        />
      </div>

      <FormTitle :titleText="t('FormSections.IntervDetails')" />

      <div class="row mb-3">
        <FieldText
          v-if="props.isEdit || intervDataDet.description"
          :label-text="t('FormField.Description')"
          field-name="description"
          :is-login-form="true"
          :is-textarea="true"
          :max-length="500"
          v-model:text-det="intervDataDet.description"
          :readonly="!props.isEdit"
        />

        <FieldSelector
          :label-text="t('FormField.TypeSinisterCat')"
          :options-list="intervCatTypeList"
          :is-required="true"
          v-model:option="intervDataDet.intervCatTypeId"
          field-name="intervCatTypeId"
          :readonly="!props.isEdit"
        />

        <FieldSelector
          :label-text="t('FormField.TypeSinister')"
          :options-list="intervTypeList"
          :is-required="true"
          v-model:option="intervDataDet.intervTypeId"
          field-name="intervTypeId"
          :readonly="!props.isEdit"
        />

        <FieldText
          v-if="props.isEdit || intervDataDet.informantExtraDetail"
          :label-text="t('FormField.OtherInfo')"
          field-name="informantExtraDetail"
          :is-login-form="true"
          :is-textarea="true"
          :max-length="255"
          v-model:text-det="intervDataDet.informantExtraDetail"
          :readonly="!props.isEdit"
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
          :readonly="!props.isEdit"
        />

        <FieldSelector
          :label-text="t('FormField.ReceivedBy')"
          :options-list="notifRecipList"
          :is-required="true"
          v-model:option="intervDataDet.notificationRecipId"
          field-name="notificationRecipId"
          :readonly="!props.isEdit"
        />

        <FieldDate
          v-if="props.isEdit || intervDataDet.informantCallTime"
          :label-text="t('FormField.CallTime')"
          v-model:date-val="intervDataDet.informantCallTime"
          :max-date="new Date()"
          :include-time="true"
          field-name="informantCallTime"
          :readonly="!props.isEdit"
        />

        <FieldText
          :label-text="t('FormField.FullName')"
          field-name="informantName"
          :max-length="100"
          :is-required="true"
          v-model:text-det="intervDataDet.informantName"
          :readonly="!props.isEdit"
        />

        <FieldNumber
          v-if="
            props.isEdit || (intervDataDet.informantDocument && intervDataDet.informantDocument > 0)
          "
          :label-text="t('FormField.Document')"
          v-model:num-val="intervDataDet.informantDocument"
          field-name="informantDocument"
          :max-length="20"
          :readonly="!props.isEdit"
        />

        <FieldPhone
          v-if="props.isEdit || intervDataDet.informantPhone"
          :label-text="t('FormField.Phone')"
          field-name="informantPhone"
          v-model:phone-val="intervDataDet.informantPhone"
          :readonly="!props.isEdit"
        />
      </div>

      <FormTitle :titleText="t('FormSections.LocationDetails')" />

      <div class="row">
        <FieldSelector
          :label-text="t('FormField.Province')"
          :options-list="provinceList"
          :is-required="true"
          v-model:option="intervDataDet.provinceId"
          field-name="provinceId"
          :readonly="!props.isEdit"
        />

        <FieldSelector
          :label-text="t('FormField.City')"
          :options-list="localityList"
          :is-required="true"
          v-model:option="intervDataDet.localityId"
          field-name="localityId"
          :readonly="!props.isEdit"
        />

        <FieldText
          :label-text="t('FormField.Direction')"
          field-name="address"
          :max-length="150"
          :is-required="true"
          v-model:text-det="intervDataDet.address"
          :readonly="!props.isEdit"
        />

        <FieldText
          v-if="props.isEdit || intervDataDet.addressExtraDetail"
          :label-text="t('FormField.OtherInfo')"
          field-name="addressExtraDetail"
          :max-length="255"
          :is-login-form="true"
          :is-textarea="true"
          v-model:text-det="intervDataDet.addressExtraDetail"
          :readonly="!props.isEdit"
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
    isEdit?: boolean;
  }>(),
  {
    bombList: () => [],
    isEdit: true,
  },
);

const notifMethodList = ref<{ id: string; name: string }[]>([]);
const provinceList = ref<{ id: string; name: string }[]>([]);
const localityList = ref<{ id: string; name: string }[]>([]);
const intervCatTypeList = ref<{ id: string; name: string }[]>([]);
const intervTypeList = ref<{ id: string; name: string }[]>([]);

const typesCatDetail = ref<{ types: IntervTypeData[]; classifId: string }[]>([]);
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
  intervCatTypeId: '',
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

    typesDetail.data.forEach((type) => {
      intervCatTypeList.value.push({ id: type.id, name: type.classifName });
      typesCatDetail.value.push({ types: type.types, classifId: type.id });
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
    if (newVal !== '') {
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
