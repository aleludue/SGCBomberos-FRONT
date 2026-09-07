<template>
  <div class="tab-pane fade show active" id="data-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column">
      <FormTitle :titleText="$t('FormSections.BaseData')" />
      <div class="row mb-3">
        <FieldNumber
          label-text="actNumber"
          v-model:num-val="intervDataDet.actNumber"
          field-name="actNumber"
          :is-required="true"
        />

        <FieldDate
          label-text="startAt"
          v-model:date-val="intervDataDet.startAt"
          :is-required="true"
          :max-date="new Date()"
          :include-time="true"
          field-name="startAt"
        />

        <FieldDate
          label-text="endAt"
          v-model:date-val="intervDataDet.endAt"
          :min-date="intervDataDet.startAt"
          :max-date="new Date()"
          :include-time="true"
          field-name="endAt"
        />

        <FieldSelector
          label-text="intervCatTypeId"
          :options-list="intervCatTypeList"
          :is-required="true"
          v-model:option="intervDataDet.intervCatTypeId"
          field-name="intervCatTypeId"
        />

        <FieldSelector
          label-text="intervTypeId"
          :options-list="intervTypeList"
          :is-required="true"
          v-model:option="intervDataDet.intervTypeId"
          field-name="intervTypeId"
        />

        <FieldText
          label-text="description"
          field-name="description"
          :is-login-form="true"
          :is-textarea="true"
          :max-length="500"
          v-model:text-det="intervDataDet.description"
        />
      </div>

      <FormTitle titleText="Aviso" />
      <div class="row mb-3">
        <FieldSelector
          label-text="notificationMethodId"
          :options-list="notifMethodList"
          :is-required="true"
          v-model:option="intervDataDet.notificationMethodId"
          field-name="notificationMethodId"
        />

        <FieldSelector
          label-text="notificationRecipId"
          :options-list="notifRecipList"
          :is-required="true"
          v-model:option="intervDataDet.notificationRecipId"
          field-name="notificationRecipId"
        />

        <FieldDate
          label-text="informantCallTime"
          v-model:date-val="intervDataDet.informantCallTime"
          :max-date="new Date()"
          :include-time="true"
          field-name="informantCallTime"
        />

        <FieldText
          label-text="informantName"
          field-name="informantName"
          :max-length="100"
          :is-required="true"
          v-model:text-det="intervDataDet.informantName"
        />

        <FieldNumber
          label-text="informantDocument"
          v-model:num-val="intervDataDet.informantDocument"
          field-name="informantDocument"
          :max-length="20"
        />

        <FieldPhone
          label-text="informantPhone"
          field-name="informantPhone"
          v-model:phone-val="intervDataDet.informantPhone"
        />

        <FieldText
          label-text="informantExtraDetail"
          field-name="informantExtraDetail"
          :is-login-form="true"
          :is-textarea="true"
          :max-length="255"
          v-model:text-det="intervDataDet.informantExtraDetail"
        />
      </div>

      <FormTitle titleText="Lugar" />
      <div class="row mb-3">
        <FieldSelector
          label-text="provinceId"
          :options-list="provinceList"
          :is-required="true"
          v-model:option="intervDataDet.provinceId"
          field-name="provinceId"
        />

        <FieldSelector
          label-text="localityId"
          :options-list="localityList"
          :is-required="true"
          v-model:option="intervDataDet.localityId"
          field-name="localityId"
        />

        <FieldText
          label-text="address"
          field-name="address"
          :max-length="150"
          :is-required="true"
          v-model:text-det="intervDataDet.address"
        />

        <FieldText
          label-text="addressExtraDetail"
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
import type { IntervTypeData } from '@/features/interventions/interfaces/interventions.interfaces';
import { getLocalitiesList, getProvincesList } from '@/shared/services/generic.action';

const toast = useToast();
const { t } = useI18n();

const notifMethodList = ref<{ id: number; name: string }[]>([]);
const provinceList = ref<{ id: number; name: string }[]>([]);
const localityList = ref<{ id: number; name: string }[]>([]);
const intervCatTypeList = ref<{ id: number; name: string }[]>([]);
const intervTypeList = ref<{ id: number; name: string }[]>([]);

const typesCatDetail = ref<{ types: IntervTypeData[]; classifId: number }[]>([]);
const notifRecipList = ref<{ id: number; name: string }[]>([
  { id: 1, name: 'Tel. 100' },
  { id: 2, name: 'Tel. 400000' },
  { id: 3, name: 'Tel. 401000' },
]);

const intervDataDet = reactive({
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
  localityId: 0,
  provinceId: 0,
  intervTypeId: 0,
  intervCatTypeId: 0,
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
  () => intervDataDet.intervCatTypeId,
  async (newVal) => {
    if (newVal > 0) {
      const catDetail = typesCatDetail.value.find((cat) => cat.classifId === newVal);
      if (catDetail) {
        intervTypeList.value = catDetail.types.map((type) => ({ id: type.id, name: type.name }));
      }
    } else {
      intervTypeList.value = [];
      intervDataDet.intervTypeId = 0;
    }
  },
  { immediate: true },
);

watch(
  () => intervDataDet.provinceId,
  async (newVal, oldVal) => {
    if (newVal === oldVal) return;

    localityList.value = [];
    intervDataDet.localityId = 0;

    if (!newVal) return;

    const { ok, data } = await getLocalitiesList(intervDataDet.provinceId);

    if (ok && data) {
      localityList.value = data;
    }
  },
  { immediate: true },
);
</script>
