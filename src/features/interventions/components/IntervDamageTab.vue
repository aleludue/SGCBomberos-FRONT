<template>
  <div class="tab-pane fade" id="damage-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column">
      <FormTitle v-if="isEdit" :titleText="t('Buttons.Add')" />

      <form v-if="isEdit" @submit.prevent="addDamnif" id="formDamnifAdd">
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

        <div v-if="radioOptSel != 0" class="d-flex mt-3 mb-3 w-100 btn-responsive-wrapper gap-3">
          <BtnConfirm
            form="formDamnifAdd"
            type="submit"
            icon="bi-plus"
            :text-detail="$t('Buttons.Add')"
          />
          <BtnConfirm
            type="button"
            icon="bi-x-circle"
            colorType="secondary"
            :text-detail="$t('Buttons.Cancel')"
            @click="cancelAddDamn"
          />
        </div>
      </form>

      <FormTitle
        v-if="listDmgPeople?.length || listDmgVehi?.length || listDmgProp?.length"
        :titleText="t('FormField.Casualties')"
      />

      <NoRecordAlert
        v-if="listDmgPeople?.length == 0 && listDmgVehi?.length == 0 && listDmgProp?.length == 0"
      />

      <div class="row g-3">
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
          @edit="editPerson(pers.id)"
          @close="removePerson(pers.id)"
          :readonly="!isEdit"
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
            vehi.hasAirbag ? $t('SelectOptions.Yes') : $t('SelectOptions.No'),
            vehi.insuranceCompanyName ?? '',
            vehi.ownerFullName,
            vehi.ownerDocNumber ?? '',
            vehi.ownerAddress ?? '',
          ]"
          @edit="editVehi(vehi.id)"
          @close="removeVehi(vehi.id)"
          :readonly="!isEdit"
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
          @edit="editProp(prop.id)"
          @close="removeProp(prop.id)"
          :readonly="!isEdit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { reactive, ref, watch, nextTick } from 'vue';
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
import NoRecordAlert from '@/shared/components/NoRecordAlert.vue';

const { t } = useI18n();
const { handleSubmit, resetForm } = useForm();

withDefaults(
  defineProps<{
    isEdit?: boolean;
  }>(),
  {
    isEdit: true,
  },
);

const listDmgId = ref<number>(1);
const radioOptSel = ref<number>(0);

const listDmgPeople = defineModel<IntervDmgPerson[]>('listDmgPeople');
const listDmgVehi = defineModel<IntervDmgVehicle[]>('listDmgVehi');
const listDmgProp = defineModel<IntervDmgProperty[]>('listDmgProp');

const damnifDetail = reactive({
  id: '',
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
        id: damnifDetail.id ? damnifDetail.id : listDmgId.value.toString(),
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
        id: damnifDetail.id ? damnifDetail.id : listDmgId.value.toString(),
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
        id: damnifDetail.id ? damnifDetail.id : listDmgId.value.toString(),
        propertyType: values.propertyType,
        roomsCount: values.roomsCount != 0 ? values.roomsCount : null,
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

const editPerson = async (id?: string) => {
  radioOptSel.value = 1;
  await nextTick();

  const optSelDet = listDmgPeople.value?.find((x) => x.id == id);

  damnifDetail.id = optSelDet?.id ?? '';
  damnifDetail.fullName = optSelDet?.fullName ?? '';
  damnifDetail.docNumber = Number(optSelDet?.docNumber);
  damnifDetail.address = optSelDet?.address ?? '';
  damnifDetail.healthStatus = optSelDet?.healthStatus ?? '';
  damnifDetail.transferDestination = optSelDet?.transferDestination ?? '';

  listDmgPeople.value = listDmgPeople.value?.filter((x) => x.id != id);
};

const editVehi = async (id?: string) => {
  radioOptSel.value = 2;
  await nextTick();

  const optSelDet = listDmgVehi.value?.find((x) => x.id == id);

  damnifDetail.id = optSelDet?.id ?? '';
  damnifDetail.mark = optSelDet?.mark ?? '';
  damnifDetail.model = optSelDet?.model ?? '';
  damnifDetail.licensePlate = optSelDet?.licensePlate ?? '';
  damnifDetail.hasAirbag = optSelDet?.hasAirbag ?? false;
  damnifDetail.fullName = optSelDet?.ownerFullName ?? '';
  damnifDetail.docNumber = Number(optSelDet?.ownerDocNumber);
  damnifDetail.address = optSelDet?.ownerAddress ?? '';
  damnifDetail.insuranceCompanyName = optSelDet?.insuranceCompanyName ?? '';

  listDmgVehi.value = listDmgVehi.value?.filter((x) => x.id != id);
};

const editProp = async (id?: string) => {
  radioOptSel.value = 3;
  await nextTick();

  const optSelDet = listDmgProp.value?.find((x) => x.id == id);

  damnifDetail.id = optSelDet?.id ?? '';
  damnifDetail.propertyType = optSelDet?.propertyType ?? '';
  damnifDetail.roomsCount = Number(optSelDet?.roomsCount);
  damnifDetail.constructionType = optSelDet?.constructionType ?? '';
  damnifDetail.fullName = optSelDet?.ownerFullName ?? '';
  damnifDetail.docNumber = Number(optSelDet?.ownerDocNumber);
  damnifDetail.address = optSelDet?.ownerAddress ?? '';
  damnifDetail.insuranceCompanyName = optSelDet?.insuranceCompanyName ?? '';
  damnifDetail.insuranceSocialReason = optSelDet?.insuranceSocialReason ?? '';
  damnifDetail.insuranceBranch = optSelDet?.insuranceBranch ?? '';

  listDmgProp.value = listDmgProp.value?.filter((x) => x.id != id);
};

const removePerson = (id?: string) => {
  listDmgPeople.value = listDmgPeople.value?.filter((x) => x.id != id);
};

const removeVehi = (id?: string) => {
  listDmgVehi.value = listDmgVehi.value?.filter((x) => x.id != id);
};

const removeProp = (id?: string) => {
  listDmgProp.value = listDmgProp.value?.filter((x) => x.id != id);
};

const cancelAddDamn = () => {
  radioOptSel.value = 0;
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
