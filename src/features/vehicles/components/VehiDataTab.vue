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
            :num-val="vehiDetail.year"
            field-name="year"
            :is-required="true"
          />

          <FieldNumber
            :label-text="$t('FormField.InternalNum')"
            :num-val="vehiDetail.internalNumber"
            field-name="internalNumber"
            :is-required="true"
          />
        </div>

        <FormTitle :titleText="$t('FormSections.TechnicalData')" />
        <div class="row mb-3">
          <FieldNumber
            :label-text="$t('VehiclesViews.CapacityPersonal')"
            :num-val="vehiDetail.capacityPersonal"
            field-name="capacityPersonal"
            :is-required="true"
          />

          <FieldNumber
            :label-text="$t('VehiclesViews.CapacityWater')"
            :num-val="vehiDetail.capacityWater"
            field-name="capacityWater"
            :is-required="true"
          />

          <div class="col-12 col-md-6 col-lg-4">
            <FieldSwitch
              :labelText="$t('FormField.SpecializedDriver')"
              v-model="vehiDetail.specializedDriver"
              :textActive="$t('SelectOptions.Yes')"
              :textInactive="$t('SelectOptions.No')"
            />
          </div>
        </div>

        <FormTitle :titleText="$t('FormSections.ServiceHistory')" />
        <div class="row mb-3">
          <FieldDate
            :label-text="$t('FormField.EntryDate')"
            v-model:date-val="vehiDetail.dateOfEntry"
            :is-required="true"
            :min-date="new Date(new Date().setFullYear(new Date().getFullYear() - 50))"
            :max-date="new Date()"
            field-name="dateOfEntry"
          />

          <FieldDate
            :label-text="$t('FormField.RemovalDate')"
            v-model:date-val="vehiDetail.dateOfRemoval"
            :min-date="new Date(new Date().setFullYear(new Date().getFullYear() - 50))"
            :max-date="new Date()"
            field-name="dateOfRemoval"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';

import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import FieldSwitch from '@/shared/components/Inputs/FieldSwitch.vue';

//import { useSiteConfigStore } from '@/shared/stores/config.store';

import { getVehicleDetails } from '@/features/vehicles/services/vehicles.action';

const { t } = useI18n();
const toast = useToast();
const { handleSubmit: handleLogin } = useForm();
//const { activeSpinner, desactivateSpinner } = useSiteConfigStore();

const props = withDefaults(
  defineProps<{
    id: number;
  }>(),
  {
    id: 0,
  },
);

const vehiDetail = reactive({
  mark: '',
  model: '',
  year: 0,
  internalNumber: 0,
  dateOfEntry: undefined as Date | undefined,
  dateOfRemoval: undefined as Date | undefined,
  vehicleType: '',
  specializedDriver: false as boolean,
  capacityPersonal: 0,
  capacityWater: 0,
});

onMounted(async () => {
  const vehiData = await getVehicleDetails(props.id);

  if (vehiData.ok && vehiData.data) {
    Object.assign(vehiDetail, vehiData.data);
  } else {
    toast.error(vehiData.message ?? t('Messages.ErrorLoading'));
  }
});

const saveVehiData = handleLogin(async () => {});
</script>
