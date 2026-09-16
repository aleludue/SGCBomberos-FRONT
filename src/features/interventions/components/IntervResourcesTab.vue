<template>
  <div class="tab-pane fade" id="resources-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column">
      <FormTitle :titleText="t('FormSections.BombInterv')" />

      <div class="row mb-4">
        <div
          class="btn-group d-flex flex-wrap gap-2 mt-2"
          role="group"
          aria-label="checkbox toggle button group"
        >
          <div v-for="bombe in bombList" :key="bombe.id">
            <input
              type="checkbox"
              class="btn-check"
              :id="'btncheckInterv' + bombe.id"
              :value="bombe.id"
              v-model="bombIntervSelec"
              @change="onIntervChange(bombe.id)"
              autocomplete="off"
            />
            <label class="btn btn-custom-fire" :for="'btncheckInterv' + bombe.id">
              {{ bombe.name }}
            </label>
          </div>
        </div>
      </div>

      <FormTitle :titleText="t('FormSections.BombStation')" />

      <div class="row mb-4">
        <div
          class="btn-group d-flex flex-wrap gap-2 mt-2"
          role="group"
          aria-label="checkbox toggle button group"
        >
          <div v-for="bombe in bombList" :key="bombe.id">
            <input
              type="checkbox"
              class="btn-check"
              :id="'btncheckSupport' + bombe.id"
              :value="bombe.id"
              v-model="bombSupportSelec"
              @change="onSupportChange(bombe.id)"
              autocomplete="off"
            />
            <label class="btn btn-custom-fire" :for="'btncheckSupport' + bombe.id">
              {{ bombe.name }}
            </label>
          </div>
        </div>
      </div>

      <FormTitle :titleText="t('FormSections.VehiInterv')" />

      <form @submit.prevent="addVehi" id="formVehiAdd">
        <div class="row mb-4">
          <FieldSelector
            :label-text="t('FormField.Vehicle')"
            :options-list="vehiList"
            :is-required="true"
            v-model:option="vehiSelecId"
            field-name="vehiSelecId"
          />

          <FieldSelector
            :label-text="t('FormField.Driver')"
            :options-list="driversList"
            :is-required="true"
            v-model:option="driverSelecId"
            field-name="driverSelecId"
          />

          <div class="col-12 col-md-6 col-lg-4 d-flex align-items-end mt-2 mb-2">
            <BtnConfirm
              type="submit"
              form="formVehiAdd"
              icon="bi-plus"
              :text-detail="$t('Buttons.Add')"
            />
          </div>

          <div
            class="btn-group d-flex flex-wrap gap-2 mt-2"
            role="group"
            aria-label="checkbox toggle button group"
          >
            <div v-for="vehiCompl in vehiCompSelec" :key="vehiCompl.vehicleId">
              <input
                type="checkbox"
                class="btn-check"
                :id="'btncheckVehi' + vehiCompl.vehicleId"
                autocomplete="off"
                :checked="true"
                onclick="return false;"
              />
              <label class="btn btn-custom-fire" :for="'btncheckVehi' + vehiCompl.vehicleId">
                {{ vehiCompl.name }}
                <i
                  class="bi bi-x-lg text-white ms-1"
                  @click="removeVehi(vehiCompl.vehicleId)"
                  :title="t('Buttons.Delete')"
                ></i>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { ref } from 'vue';
import { useForm } from 'vee-validate';

import FormTitle from '@/shared/components/FormTitle.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';

const toast = useToast();
const { t } = useI18n();
const { handleSubmit, resetForm } = useForm();

const props = withDefaults(
  defineProps<{
    bombList: { id: string; name: string }[];
    vehiList: { id: string; name: string }[];
    driversList: { id: string; name: string }[];
  }>(),
  {
    bombList: () => [],
    vehiList: () => [],
    driversList: () => [],
  },
);

const vehiSelecId = ref<string>('');
const driverSelecId = ref<string>('');

const bombSupportSelec = defineModel<string[]>('bombSupportSelec');
const bombIntervSelec = defineModel<string[]>('bombIntervSelec');
const vehiCompSelec =
  defineModel<{ vehicleId: string; driverId: string; name: string }[]>('vehiCompSelec');

const onIntervChange = (id: string) => {
  if (bombIntervSelec.value?.includes(id)) {
    bombSupportSelec.value = [
      ...(bombSupportSelec.value?.filter((bombeId) => bombeId !== id) ?? []),
    ];
  }
};

const onSupportChange = (id: string) => {
  if (bombSupportSelec.value?.includes(id)) {
    bombIntervSelec.value = [...(bombIntervSelec.value?.filter((bombeId) => bombeId !== id) ?? [])];
  }
};

const addVehi = handleSubmit(async () => {
  const vehiUsed = vehiCompSelec.value?.some((x) => x.vehicleId == vehiSelecId.value);
  const driverUsed = vehiCompSelec.value?.some((x) => x.driverId == driverSelecId.value);

  if (vehiUsed || driverUsed) {
    toast.error(t('Validations.VehiDriverUsed'));
    return;
  }

  const vehiName = props.vehiList.find((x) => x.id == vehiSelecId.value)?.name ?? '';
  const drivName = props.driversList.find((x) => x.id == driverSelecId.value)?.name ?? '';

  vehiCompSelec.value = [
    ...(vehiCompSelec.value ?? []),
    {
      vehicleId: vehiSelecId.value,
      driverId: driverSelecId.value,
      name: 'Vehiculo: ' + vehiName + ' - Chofer: ' + drivName,
    },
  ];

  driverSelecId.value = '';
  vehiSelecId.value = '';
  resetForm();
});

const removeVehi = (id: string) => {
  vehiCompSelec.value = [...(vehiCompSelec.value?.filter((x) => x.vehicleId != id) ?? [])];
};
</script>
