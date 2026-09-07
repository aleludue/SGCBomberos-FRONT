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
      Datos
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
      Recursos
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
      Damnificados
    </button>
  </nav>

  <form @submit.prevent="saveIntervData">
    <div class="tab-content" id="intervTabContent">
      <IntervDataTab />

      <IntervResourcesTab />

      <IntervDamageTab />

      <div class="d-flex mt-3 mb-0 w-100 btn-responsive-wrapper">
        <BtnConfirm type="submit" size="sm" :text-detail="$t('Buttons.Save')" />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { useSiteConfigStore } from '@/shared/stores/config.store';
//import { useToast } from 'vue-toastification';

import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import IntervDataTab from './IntervDataTab.vue';
import IntervResourcesTab from './IntervResourcesTab.vue';
import IntervDamageTab from './IntervDamageTab.vue';

const { t } = useI18n();
//const toast = useToast();
const { handleSubmit } = useForm();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();

//const intervId = computed<number>(() => Number(route.params.id) || 0);

const saveIntervData = handleSubmit(async () => {
  activeSpinner(t('Messages.Update'));

  // ver resty

  desactivateSpinner();
});
</script>
