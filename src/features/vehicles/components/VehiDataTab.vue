<template>
  <div class="tab-pane fade px-1 show active" id="data-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column">
      <form @submit.prevent="saveVehiData">
        <FormTitle :titleText="$t('FormSections.BaseData')" />
        <div class="row mb-3">
          <FieldText
            :label-text="$t('FormField.Mark')"
            field-name="make"
            :is-required="true"
            :max-length="50"
            v-model:text-det="vehiDetail.mark"
          />

          <FieldText
            :label-text="$t('FormField.Model')"
            field-name="model"
            :is-required="true"
            :max-length="50"
            v-model:text-det="vehiDetail.model"
          />

          <FieldNumber
            :label-text="$t('FormField.Year')"
            v-model:num-val="vehiDetail.year"
            field-name="year"
            :is-required="true"
          />

          <FieldNumber
            :label-text="$t('FormField.InternalNum')"
            v-model:num-val="vehiDetail.internalNumber"
            field-name="internalNumber"
            :is-required="true"
          />

          <FieldSelector
            :label-text="$t('VehiclesViews.VehiType')"
            :options-list="vehiTypesList"
            :is-required="true"
            v-model:option="vehiDetail.vehicleTypeId"
            field-name="vehicleTypeId"
          />

          <FieldDate
            :label-text="$t('FormField.EntryDate')"
            v-model:date-val="vehiDetail.dateOfEntry"
            :is-required="true"
            :min-date="new Date(new Date().setFullYear(new Date().getFullYear() - 50))"
            :max-date="new Date()"
            field-name="dateOfEntry"
          />
        </div>

        <FormTitle :titleText="$t('FormSections.TechnicalData')" />
        <div class="row mb-3">
          <FieldNumber
            :label-text="$t('VehiclesViews.CapacityPersonal')"
            v-model:num-val="vehiDetail.capacityPersonal"
            field-name="capacityPersonal"
            :is-required="false"
          />

          <FieldNumber
            :label-text="$t('VehiclesViews.CapacityWater')"
            v-model:num-val="vehiDetail.capacityWater"
            field-name="capacityWater"
            :is-required="false"
          />

          <FieldSwitch
            :labelText="$t('FormField.SpecializedDriver')"
            v-model="vehiDetail.specializedDriver"
            :textActive="$t('SelectOptions.Yes')"
            :textInactive="$t('SelectOptions.No')"
          />
        </div>

        <div class="d-flex mt-3 mb-0 w-100 btn-responsive-wrapper">
          <BtnConfirm type="submit" size="sm" class="px-5 py-2 shadow-sm fw-bold">
            <i class="bi bi-save me-2"></i> {{ $t('Buttons.Save') }}
          </BtnConfirm>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';

import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import FieldSwitch from '@/shared/components/Inputs/FieldSwitch.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';

import {
  getVehicleDetails,
  saveVehicle,
  updateVehicle,
} from '@/features/vehicles/services/vehicles.action';
import type { VehicleSaveData } from '@/features/vehicles/interfaces/vehicles.interfaces';
import { getVehicleTypes } from '@/features/vehicles/services/vehicleType.action';

const { t } = useI18n();
const toast = useToast();
const { handleSubmit, resetForm } = useForm();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const router = useRouter();

const props = withDefaults(
  defineProps<{
    id: number;
  }>(),
  {
    id: 0,
  },
);

const vehiTypesList = ref<{ id: number; name: string }[]>([]);
const vehiDetail = reactive({
  mark: '',
  model: '',
  year: 0,
  internalNumber: 0,
  dateOfEntry: undefined as Date | undefined,
  vehicleType: '',
  vehicleTypeId: 0,
  specializedDriver: false as boolean,
  capacityPersonal: 0,
  capacityWater: 0,
});

onMounted(async () => {
  const vehiTypes = await getVehicleTypes();
  if (vehiTypes.ok && vehiTypes.data) {
    vehiTypesList.value = vehiTypes.data;
  } else {
    toast.error(vehiTypes.message ?? t('Messages.ErrorLoading'));
  }

  if (props.id === 0) {
    return;
  }

  const vehiData = await getVehicleDetails(props.id);

  if (vehiData.ok && vehiData.data) {
    vehiDetail.vehicleTypeId =
      vehiTypesList.value.find((v) => v.name === vehiData.data!.vehicleType)?.id ?? 0;
    Object.assign(vehiDetail, vehiData.data);
    resetForm({ values: { ...vehiData.data } });
  } else {
    toast.error(vehiData.message ?? t('Messages.ErrorLoading'));
  }
});

const saveVehiData = handleSubmit(async (values) => {
  activeSpinner(t('Messages.Update'));

  const req: VehicleSaveData = {
    typeId: values.vehicleTypeId,
    intNum: values.internalNumber,
    mark: values.make,
    model: values.model,
    year: values.year,
    capacityPersonal: values.capacityPersonal,
    capacityWater: values.capacityWater,
    specializedDriver: vehiDetail.specializedDriver,
    dateOfEntry: values.dateOfEntry,
  };

  const { ok, message } =
    props.id === 0 ? await saveVehicle(req) : await updateVehicle(props.id, req);

  if (ok) {
    toast.success(message);

    if (props.id === 0) {
      await router.push(`/vehicles/consult`);
    }
  } else {
    toast.error(message ?? t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});
</script>
