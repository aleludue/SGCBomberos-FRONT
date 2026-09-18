<template>
  <nav class="nav nav-tabs nav-justified border-0 mb-3" id="intervTabHead" role="tablist">
    <button
      class="nav-link active fw-bold text-uppercase py-2"
      id="data-tab"
      data-bs-toggle="tab"
      data-bs-target="#data-tab-pane"
      type="button"
      role="tab"
      aria-selected="true"
    >
      {{ t('FormField.Data') }}
      <i v-if="Object.keys(errors).length" class="bi bi-exclamation-circle text-danger"></i>
    </button>

    <button
      class="nav-link fw-bold text-uppercase py-2"
      id="resources-tab"
      data-bs-toggle="tab"
      data-bs-target="#resources-tab-pane"
      type="button"
      role="tab"
      aria-selected="true"
    >
      {{ t('FormField.Resources') }}
      <i v-if="showErrorRes" class="bi bi-exclamation-circle text-danger"></i>
    </button>

    <button
      class="nav-link fw-bold text-uppercase py-2"
      id="damage-tab"
      data-bs-toggle="tab"
      data-bs-target="#damage-tab-pane"
      type="button"
      role="tab"
      aria-selected="true"
    >
      {{ t('FormField.Casualties') }}
      <i v-if="showErrorDam" class="bi bi-exclamation-circle text-danger"></i>
    </button>
  </nav>

  <form @submit.prevent="saveIntervData">
    <div class="tab-content">
      <IntervDataTab :bomb-list="bombList" v-model:interv-data-det="intervData" />

      <IntervResourcesTab
        :bomb-list="bombList"
        :vehi-list="vehiList"
        :drivers-list="driversList"
        v-model:bomb-support-selec="bombSupportSelec"
        v-model:bomb-interv-selec="bombIntervSelec"
        v-model:vehi-comp-selec="vehiCompSelec"
      />

      <IntervDamageTab
        v-model:list-dmg-people="listDmgPeople"
        v-model:list-dmg-prop="listDmgProp"
        v-model:list-dmg-vehi="listDmgVehi"
      />

      <div class="d-flex mt-3 mb-0 w-100 btn-responsive-wrapper">
        <BtnConfirm
          type="submit"
          size="sm"
          :text-detail="$t('Buttons.Save')"
          @click="validateForm"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';

import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import IntervDataTab from '@/features/interventions/components/IntervDataTab.vue';
import IntervResourcesTab from '@/features/interventions/components/IntervResourcesTab.vue';
import IntervDamageTab from '@/features/interventions/components/IntervDamageTab.vue';
import type {
  IntervDataDet,
  IntervDmgPerson,
  IntervDmgProperty,
  IntervDmgVehicle,
  SaveIntervRequest,
} from '@/features/interventions/interfaces/interventions.interfaces';
import {
  getIntervDetail,
  saveIntervention,
} from '@/features/interventions/services/interventions.action';
import { getBombInService } from '@/features/bomberos/services/bomberos.action';
import { getVehicles } from '@/features/vehicles/services/vehicles.action';

const { t } = useI18n();
const { handleSubmit, errors, resetForm } = useForm();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const intervId = computed(() => route.params.id || '');
const driversList = ref<{ id: string; name: string }[]>([]);
const bombList = ref<{ id: string; name: string }[]>([]);
const vehiList = ref<{ id: string; name: string }[]>([]);

const listDmgPeople = ref<IntervDmgPerson[]>([]);
const listDmgVehi = ref<IntervDmgVehicle[]>([]);
const listDmgProp = ref<IntervDmgProperty[]>([]);

const bombSupportSelec = ref<string[]>([]);
const bombIntervSelec = ref<string[]>([]);
const vehiCompSelec = ref<{ vehicleId: string; driverId: string; name: string }[]>([]);

const intervData = ref<IntervDataDet>();

const showErrorDam = ref(false);
const showErrorRes = ref(false);

onMounted(async () => {
  const [bombInServDetail, vehiclesDetail] = await Promise.all([getBombInService(), getVehicles()]);

  if (bombInServDetail.ok && bombInServDetail.data && vehiclesDetail.ok && vehiclesDetail.data) {
    bombInServDetail.data.forEach((bomb) => {
      bombList.value.push({
        id: bomb.id,
        name: bomb.internalNum + ' - ' + bomb.fullName,
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
        name: vehi.internalNumber + ' - ' + vehi.mark + ' - ' + vehi.model,
      });
    });

    if (intervId.value) loadEditData();
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }
});

const loadEditData = async () => {
  const { ok, data, message } = await getIntervDetail(intervId.value as string);

  if (ok && data) {
    Object.assign(intervData, data);
    resetForm({ values: { ...data } });

    data.bomberos.forEach((x) => {
      if (x.goIntervention) bombIntervSelec.value.push(x.bomberoId);
      else bombSupportSelec.value.push(x.bomberoId);
    });

    data.vehiculos.forEach((v) => {
      vehiCompSelec.value.push({
        vehicleId: v.vehicleId,
        driverId: v.driverId,
        name:
          'Vehiculo: ' +
          vehiList.value.find((x) => x.id == v.vehicleId)?.name +
          ' - Chofer: ' +
          driversList.value.find((x) => x.id == v.driverId)?.name,
      });
    });

    listDmgPeople.value = data.dmgPeople;
    listDmgProp.value = data.dmgProperties;
    listDmgVehi.value = data.dmgVehicles;
  } else {
    toast.error(message ?? t('Messages.ErrorLoading'));
  }
};

const validateForm = () => {
  showErrorDam.value =
    !listDmgPeople.value.length && !listDmgVehi.value.length && !listDmgProp.value.length;

  showErrorRes.value =
    (!bombSupportSelec.value.length && !bombIntervSelec.value.length) ||
    !vehiCompSelec.value.length;
};

const saveIntervData = handleSubmit(async (values) => {
  if (showErrorDam.value || showErrorRes.value) {
    return;
  }

  activeSpinner(t('Messages.Update'));

  const req: SaveIntervRequest = {
    actNumber: values.actNumber,
    startAt: values.startAt,
    endAt: values.endAt,
    description: values.description,
    isDraft: true,

    informantName: values.informantName,
    informantDocument: values.informantDocument.toString(),
    informantPhone: values.informantPhone,
    informantCallTime: values.informantCallTime,
    informantExtraDetail: values.informantExtraDetail,
    address: values.address,
    addressExtraDetail: values.addressExtraDetail,

    localityId: values.localityId,
    intervTypeId: values.intervTypeId,
    notificationMethodId: values.notificationMethodId,
    notificationRecipId: values.notificationRecipId,
    commandChiefId: values.commandChiefId,

    bomberos: [
      ...bombIntervSelec.value.map((bomb) => ({
        bomberoId: bomb,
        goIntervention: true,
      })),
      ...bombSupportSelec.value.map((bomb) => ({
        bomberoId: bomb,
        goIntervention: false,
      })),
    ],
    vehicles: vehiCompSelec.value.map((vehi) => ({
      vehicleId: vehi.vehicleId,
      driverId: vehi.driverId,
    })),
    damagedPeople: listDmgPeople.value,
    damagedProperties: listDmgProp.value,
    damagedVehicles: listDmgVehi.value,
  };

  const { ok, message } = await saveIntervention(req);

  if (ok) {
    toast.success(message);

    if (intervId.value === '') {
      await router.push('/interventions/consult');
    }
  } else {
    toast.error(message ?? t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});
</script>
