<template>
  <div class="tab-pane fade" id="damage-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column">
      <FormTitle :titleText="t('Buttons.Add')" />

      <form @submit.prevent="addDamnif" id="formDamnifAdd">
        <div class="row mb-3">
          <div class="btn-group mb-2" role="group" aria-label="Options damage radio">
            <input
              type="radio"
              class="btn-check"
              name="rdbForm"
              id="rdbPers"
              autocomplete="off"
              :value="1"
              v-model="radioOptSel"
            />
            <label class="btn btn-outline-primary" for="rdbPers">
              {{ t('FormField.Person') }}
            </label>

            <input
              type="radio"
              class="btn-check"
              name="rdbForm"
              id="rdbVehi"
              autocomplete="off"
              :value="2"
              v-model="radioOptSel"
            />
            <label class="btn btn-outline-primary" for="rdbVehi">
              {{ t('FormField.Vehicle') }}
            </label>

            <input
              type="radio"
              class="btn-check"
              name="rdbForm"
              id="rdbProp"
              autocomplete="off"
              :value="3"
              v-model="radioOptSel"
            />
            <label class="btn btn-outline-primary" for="rdbProp">
              {{ t('FormField.Property') }}
            </label>
          </div>

          <FieldText
            v-if="radioOptSel != 0"
            :label-text="radioOptSel == 1 ? t('FormField.FullName') : t('FormField.Owner')"
            field-name="fullName"
            :is-required="true"
            :max-length="100"
            v-model:text-det="damnifDetail.fullName"
          />

          <FieldNumber
            v-if="radioOptSel != 0"
            :label-text="t('FormField.Document')"
            v-model:num-val="damnifDetail.docNumber"
            field-name="docNumber"
            :max-length="20"
          />

          <FieldText
            v-if="radioOptSel != 0"
            :label-text="t('FormField.Direction')"
            field-name="address"
            :max-length="150"
            v-model:text-det="damnifDetail.address"
          />

          <FieldText
            v-if="radioOptSel == 2"
            :label-text="t('FormField.Mark')"
            field-name="mark"
            :is-required="true"
            :max-length="100"
            v-model:text-det="damnifDetail.mark"
          />

          <FieldText
            v-if="radioOptSel == 2"
            :label-text="t('FormField.Model')"
            field-name="model"
            :is-required="true"
            :max-length="100"
            v-model:text-det="damnifDetail.model"
          />

          <FieldText
            v-if="radioOptSel == 2"
            :label-text="t('FormField.LicensePlate')"
            field-name="licensePlate"
            :max-length="15"
            v-model:text-det="damnifDetail.licensePlate"
          />

          <FieldSwitch
            v-if="radioOptSel == 2"
            :labelText="t('FormField.Airbag')"
            v-model="damnifDetail.hasAirbag"
            :textActive="$t('SelectOptions.Yes')"
            :textInactive="$t('SelectOptions.No')"
          />

          <FieldText
            v-if="radioOptSel == 3"
            :label-text="t('FormField.Type')"
            field-name="propertyType"
            :is-required="true"
            :max-length="100"
            v-model:text-det="damnifDetail.propertyType"
          />

          <FieldNumber
            v-if="radioOptSel == 3"
            :label-text="t('FormField.Rooms')"
            v-model:num-val="damnifDetail.roomsCount"
            field-name="roomsCount"
          />

          <FieldText
            v-if="radioOptSel == 3"
            :label-text="t('FormField.Construction')"
            field-name="constructionType"
            :is-required="true"
            :max-length="150"
            v-model:text-det="damnifDetail.constructionType"
          />

          <FieldText
            v-if="radioOptSel == 2 || radioOptSel == 3"
            :label-text="t('FormField.Insurance')"
            field-name="insuranceCompanyName"
            :max-length="100"
            v-model:text-det="damnifDetail.insuranceCompanyName"
          />

          <FieldText
            v-if="radioOptSel == 3"
            :label-text="t('FormField.SocialReason')"
            field-name="insuranceSocialReason"
            :max-length="100"
            v-model:text-det="damnifDetail.insuranceSocialReason"
          />

          <FieldText
            v-if="radioOptSel == 3"
            :label-text="t('FormField.Branch')"
            field-name="insuranceBranch"
            :max-length="100"
            v-model:text-det="damnifDetail.insuranceBranch"
          />

          <FieldText
            v-if="radioOptSel == 1"
            :label-text="t('FormField.Status')"
            field-name="healthStatus"
            :is-required="true"
            :max-length="50"
            v-model:text-det="damnifDetail.healthStatus"
          />

          <FieldText
            v-if="radioOptSel == 1"
            :label-text="t('FormField.Destination')"
            field-name="transferDestination"
            :max-length="100"
            v-model:text-det="damnifDetail.transferDestination"
          />
        </div>

        <div v-if="radioOptSel != 0" class="d-flex mt-3 mb-3 w-100 btn-responsive-wrapper">
          <BtnConfirm
            form="formDamnifAdd"
            type="submit"
            icon="bi-plus"
            :text-detail="$t('Buttons.Add')"
          />
        </div>
      </form>

      <FormTitle
        v-if="
          listDmgPeople?.values.length || listDmgVehi?.values.length || listDmgProp?.values.length
        "
        :titleText="t('FormField.Casualties')"
      />

      <div class="row g-3 mb-4">
        <CardDetail
          v-for="pers in listDmgPeople"
          :key="pers.id"
          :title-text="t('FormField.Person')"
          :body-titles="cardDmgPers"
          :body-text="[
            pers.fullName,
            pers.docNumber ?? '',
            pers.address ?? '',
            pers.healthStatus,
            pers.transferDestination ?? '',
          ]"
          @close="removePerson(pers.id)"
        />

        <CardDetail
          v-for="vehi in listDmgVehi"
          :key="vehi.id"
          :title-text="t('FormField.Vehicle')"
          :body-titles="cardDmgVehi"
          :body-text="[
            vehi.mark,
            vehi.model,
            vehi.licensePlate ?? '',
            vehi.hasAirbag ? 'Si' : 'No',
            vehi.insuranceCompanyName ?? '',
            vehi.ownerFullName,
            vehi.ownerDocNumber ?? '',
            vehi.ownerAddress ?? '',
          ]"
          @close="removeVehi(vehi.id)"
        />

        <CardDetail
          v-for="prop in listDmgProp"
          :key="prop.id"
          :title-text="t('FormField.Property')"
          :body-titles="cardDmgProp"
          :body-text="[
            prop.propertyType,
            prop.roomsCount?.toString() ?? '',
            prop.constructionType ?? '',
            prop.insuranceCompanyName ?? '',
            prop.insuranceSocialReason ?? '',
            prop.insuranceBranch ?? '',
            prop.ownerFullName,
            prop.ownerDocNumber ?? '',
            prop.ownerAddress ?? '',
          ]"
          @close="removeProp(prop.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import FieldSwitch from '@/shared/components/Inputs/FieldSwitch.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import CardDetail from '@/shared/components/CardDetail.vue';

import type {
  IntervDmgPerson,
  IntervDmgProperty,
  IntervDmgVehicle,
} from '@/features/interventions/interfaces/interventions.interfaces';

const { t } = useI18n();
const { handleSubmit, resetForm } = useForm();

const listDmgId = ref<number>(1);
const radioOptSel = ref<number>(0);

const listDmgPeople = defineModel<IntervDmgPerson[]>('listDmgPeople');
const listDmgVehi = defineModel<IntervDmgVehicle[]>('listDmgVehi');
const listDmgProp = defineModel<IntervDmgProperty[]>('listDmgProp');

const damnifDetail = reactive({
  fullName: '',
  docNumber: 0,
  address: '',
  healthStatus: '',
  transferDestination: '',
  insuranceCompanyName: '',
  insuranceSocialReason: '',
  insuranceBranch: '',
  mark: '',
  model: '',
  licensePlate: '',
  hasAirbag: false,
  propertyType: '',
  roomsCount: 0,
  constructionType: '',
});

const cardDmgPers = [
  t('FormField.FullName'),
  t('FormField.Document'),
  t('FormField.Direction'),
  t('FormField.Status'),
  t('FormField.Destination'),
];

const cardDmgVehi = [
  t('FormField.Mark'),
  t('FormField.Model'),
  t('FormField.LicensePlate'),
  t('FormField.Airbag'),
  t('FormField.Insurance'),
  t('FormField.Owner'),
  t('FormField.Document'),
  t('FormField.Direction'),
];

const cardDmgProp = [
  t('FormField.Type'),
  t('FormField.Rooms'),
  t('FormField.Construction'),
  t('FormField.Insurance'),
  t('FormField.SocialReason'),
  t('FormField.Branch'),
  t('FormField.Owner'),
  t('FormField.Document'),
  t('FormField.Direction'),
];

const addDamnif = handleSubmit(async (values) => {
  if (radioOptSel.value == 1) {
    listDmgPeople.value = [
      ...(listDmgPeople.value || []),
      {
        id: listDmgId.value,
        fullName: values.fullName,
        docNumber: values.docNumber != 0 ? values.docNumber.toString() : '',
        address: values.address,
        healthStatus: values.healthStatus,
        transferDestination: values.transferDestination,
      },
    ];
  }

  if (radioOptSel.value == 2) {
    listDmgVehi.value = [
      ...(listDmgVehi.value || []),
      {
        id: listDmgId.value,
        mark: values.mark,
        model: values.model,
        licensePlate: values.licensePlate,
        hasAirbag: damnifDetail.hasAirbag,
        ownerFullName: values.fullName,
        ownerDocNumber: values.docNumber != 0 ? values.docNumber.toString() : '',
        ownerAddress: values.address,
        insuranceCompanyName: values.insuranceCompanyName,
      },
    ];
  }

  if (radioOptSel.value == 3) {
    listDmgProp.value = [
      ...(listDmgProp.value || []),
      {
        id: listDmgId.value,
        propertyType: values.propertyType,
        roomsCount: values.roomsCount,
        constructionType: values.constructionType,
        ownerFullName: values.fullName,
        ownerDocNumber: values.docNumber != 0 ? values.docNumber.toString() : '',
        ownerAddress: values.address,
        insuranceCompanyName: values.insuranceCompanyName,
        insuranceSocialReason: values.insuranceSocialReason,
        insuranceBranch: values.insuranceBranch,
      },
    ];
  }

  listDmgId.value++;
  radioOptSel.value = 0;
});

const removePerson = (id?: number) => {
  listDmgPeople.value = listDmgPeople.value?.filter((x) => x.id != id);
};

const removeVehi = (id?: number) => {
  listDmgVehi.value = listDmgVehi.value?.filter((x) => x.id != id);
};

const removeProp = (id?: number) => {
  listDmgProp.value = listDmgProp.value?.filter((x) => x.id != id);
};

watch(
  () => radioOptSel.value,
  async () => {
    damnifDetail.fullName = '';
    damnifDetail.docNumber = 0;
    damnifDetail.address = '';
    damnifDetail.healthStatus = '';
    damnifDetail.transferDestination = '';
    damnifDetail.insuranceCompanyName = '';
    damnifDetail.insuranceSocialReason = '';
    damnifDetail.insuranceBranch = '';
    damnifDetail.mark = '';
    damnifDetail.model = '';
    damnifDetail.licensePlate = '';
    damnifDetail.hasAirbag = false;
    damnifDetail.propertyType = '';
    damnifDetail.roomsCount = 0;
    damnifDetail.constructionType = '';

    resetForm();
  },
  { immediate: true },
);
</script>
