<template>
  <nav class="nav nav-tabs nav-justified border-0 mb-3" id="intervTabHead" role="tablist">
    <button
      class="nav-link active fw-bold text-uppercase py-2"
      id="data-tab"
      data-bs-toggle="tab"
      data-bs-target="#bomb-data-tab"
      type="button"
      role="tab"
      aria-selected="true"
    >
      {{ $t('FormField.Data') }}
    </button>

    <button
      class="nav-link fw-bold text-uppercase py-2"
      id="history-tab"
      data-bs-toggle="tab"
      data-bs-target="#bomb-history-tab"
      type="button"
      role="tab"
      aria-selected="true"
    >
      Historial
    </button>

    <button
      class="nav-link fw-bold text-uppercase py-2"
      id="rank-tab"
      data-bs-toggle="tab"
      data-bs-target="#bomb-rank-tab"
      type="button"
      role="tab"
      aria-selected="true"
    >
      Rango
    </button>
  </nav>

  <div class="tab-content">
    <BombDataTab />

    <BombHistoryTab />

    <BombRankTab />
  </div>
</template>

<script setup lang="ts">
import BombDataTab from './BombDataTab.vue';
import BombHistoryTab from './BombHistoryTab.vue';
import BombRankTab from './BombRankTab.vue';
</script>
