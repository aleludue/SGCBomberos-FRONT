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
      {{ t('FormField.Resources') }} <i v-if="showErrorRes" class="bi bi-exclamation-circle"></i>
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
      {{ t('FormField.Casualties') }} <i v-if="showErrorDam" class="bi bi-exclamation-circle"></i>
    </button>
  </nav>

  <form @submit.prevent="saveIntervData">
    <div class="tab-content">
      <IntervDataTab />

      <IntervResourcesTab
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
import { ref } from 'vue';

import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import IntervDataTab from '@/features/interventions/components/IntervDataTab.vue';
import IntervResourcesTab from '@/features/interventions/components/IntervResourcesTab.vue';
import IntervDamageTab from '@/features/interventions/components/IntervDamageTab.vue';
import type {
  IntervDmgPerson,
  IntervDmgProperty,
  IntervDmgVehicle,
} from '@/features/interventions/interfaces/interventions.interfaces';

const { t } = useI18n();
const { handleSubmit } = useForm();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();

//const intervId = computed<number>(() => Number(route.params.id) || 0);

const listDmgPeople = ref<IntervDmgPerson[]>([]);
const listDmgVehi = ref<IntervDmgVehicle[]>([]);
const listDmgProp = ref<IntervDmgProperty[]>([]);

const bombSupportSelec = ref<number[]>([]);
const bombIntervSelec = ref<number[]>([]);
const vehiCompSelec = ref<{ idVehi: number; idDriver: number; name: string }[]>([]);

const showErrorDam = ref(false);
const showErrorRes = ref(false);

const validateForm = () => {
  showErrorDam.value = false;
  showErrorRes.value = false;

  if (
    !bombSupportSelec.value.length &&
    !bombIntervSelec.value.length &&
    !vehiCompSelec.value.length
  ) {
    showErrorRes.value = true;
  }

  if (!listDmgPeople.value.length && !listDmgVehi.value.length && !listDmgProp.value.length) {
    showErrorDam.value = true;
  }
};

const saveIntervData = handleSubmit(async () => {
  if (showErrorDam.value || showErrorRes.value) {
    return;
  }

  activeSpinner(t('Messages.Update'));

  // ver resty

  desactivateSpinner();
});
</script>
