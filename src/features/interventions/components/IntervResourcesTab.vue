<template>
  <div class="tab-pane fade" id="resources-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column">
      <FormTitle titleText="Bomberos en intervención" />
      <div class="row mb-4">
        <div
          class="btn-group d-flex flex-wrap gap-2"
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
              {{ bombe.internalNum + ' - ' + bombe.name }}
            </label>
          </div>
        </div>
      </div>

      <FormTitle titleText="Bomberos en cuartel" />
      <div class="row mb-4">
        <div
          class="btn-group d-flex flex-wrap gap-2"
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
              {{ bombe.internalNum + ' - ' + bombe.name }}
            </label>
          </div>
        </div>
      </div>

      <FormTitle titleText="Vehiculos participantes" />
      <div class="row mb-4"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { onMounted, ref } from 'vue';

import FormTitle from '@/shared/components/FormTitle.vue';

import { getBombInService } from '@/features/bomberos/services/bomberos.action';
import { getVehicles } from '@/features/vehicles/services/vehicles.action';

const toast = useToast();
const { t } = useI18n();

const driversList = ref<{ id: number; name: string }[]>([]);
const bombList = ref<{ id: number; name: string; internalNum: number }[]>([]);
const vehiList = ref<{ id: number; name: string; internalNum: number }[]>([]);

const bombSupportSelec = ref<number[]>([]);
const bombIntervSelec = ref<number[]>([]);

onMounted(async () => {
  const [bombInServDetail, vehiclesDetail] = await Promise.all([getBombInService(), getVehicles()]);

  if (bombInServDetail.ok && bombInServDetail.data && vehiclesDetail.ok && vehiclesDetail.data) {
    bombInServDetail.data.forEach((bomb) => {
      bombList.value.push({
        id: bomb.id,
        name: bomb.fullName,
        internalNum: bomb.internalNum,
      });

      if (bomb.isDriver) {
        driversList.value.push({
          id: bomb.id,
          name: bomb.internalNum + ' - ' + bomb.fullName,
        });
      }
    });

    vehiclesDetail.data.forEach((vehi) => {
      vehiList.value.push({
        id: vehi.id,
        name: vehi.mark + ' - ' + vehi.model,
        internalNum: vehi.internalNumber,
      });
    });
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }
});

const onIntervChange = (id: number) => {
  // Si el bombero fue seleccionado en intervención, lo removemos de soporte
  if (bombIntervSelec.value.includes(id)) {
    bombSupportSelec.value = bombSupportSelec.value.filter((bombeId) => bombeId !== id);
  }
};

// Se ejecuta al seleccionar un bombero en "Soporte"
const onSupportChange = (id: number) => {
  // Si el bombero fue seleccionado en soporte, lo removemos de intervención
  if (bombSupportSelec.value.includes(id)) {
    bombIntervSelec.value = bombIntervSelec.value.filter((bombeId) => bombeId !== id);
  }
};
</script>
