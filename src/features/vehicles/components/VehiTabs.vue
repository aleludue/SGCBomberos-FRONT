<template>
  <nav class="mb-3">
    <div class="nav nav-tabs nav-justified border-0" id="logTab" role="tablist">
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
        id="maint-tab"
        data-bs-toggle="tab"
        data-bs-target="#maint-tab-pane"
        type="button"
        role="tab"
        aria-selected="true"
      >
        Mantenimientos
      </button>
      <button
        class="nav-link fw-bold text-uppercase py-2"
        id="tools-tab"
        data-bs-toggle="tab"
        data-bs-target="#tools-tab-pane"
        type="button"
        role="tab"
        aria-selected="true"
      >
        Herramientas
      </button>
    </div>
  </nav>

  <div class="tab-content" id="myTabContent">
    <VehiDataTab :id="vehiId" />

    <VehiMaintTab :id="vehiId" />

    <VehiToolsTab :id="vehiId" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import VehiDataTab from '@/features/vehicles/components/VehiDataTab.vue';
import VehiMaintTab from '@/features/vehicles/components/VehiMaintTab.vue';
import VehiToolsTab from '@/features/vehicles/components/VehiToolsTab.vue';

const route = useRoute();

const vehiId = computed<number>(() => Number(route.params.id) || 0);
</script>
