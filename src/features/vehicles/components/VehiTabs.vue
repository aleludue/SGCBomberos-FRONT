<template>
  <nav class="nav nav-tabs nav-justified border-0 mb-3" id="logTab" role="tablist">
    <button
      class="nav-link active fw-bold text-uppercase py-2"
      id="data-tab"
      data-bs-toggle="tab"
      data-bs-target="#data-tab-pane"
      type="button"
      role="tab"
      aria-selected="true"
    >
      {{ t('VehiclesViews.TabData') }}
    </button>
    <button
      v-if="vehiId"
      class="nav-link fw-bold text-uppercase py-2"
      id="maint-tab"
      data-bs-toggle="tab"
      data-bs-target="#maint-tab-pane"
      type="button"
      role="tab"
      aria-selected="true"
    >
      {{ t('VehiclesViews.TabMaintenances') }} ({{ mantQuantity }})
    </button>
    <button
      v-if="vehiId"
      class="nav-link fw-bold text-uppercase py-2"
      id="tools-tab"
      data-bs-toggle="tab"
      data-bs-target="#tools-tab-pane"
      type="button"
      role="tab"
      aria-selected="true"
    >
      {{ t('VehiclesViews.TabTools') }} ({{ toolsQuantity }})
    </button>
  </nav>

  <div class="tab-content" id="myTabContent">
    <VehiDataTab :id="vehiId" />
    <VehiMaintTab :id="vehiId" @maint-cant="(quant: number) => (mantQuantity = quant)" />
    <VehiToolsTab :id="vehiId" @tools-cant="(quant: number) => (toolsQuantity = quant)" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import VehiDataTab from '@/features/vehicles/components/VehiDataTab.vue';
import VehiMaintTab from '@/features/vehicles/components/VehiMaintTab.vue';
import VehiToolsTab from '@/features/vehicles/components/VehiToolsTab.vue';

const { t } = useI18n();
const route = useRoute();

const vehiId = computed<number>(() => Number(route.params.id) || 0);
const mantQuantity = ref(0);
const toolsQuantity = ref(0);
</script>
