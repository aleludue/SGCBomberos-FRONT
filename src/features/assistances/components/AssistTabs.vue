<template>
  <nav class="nav nav-tabs nav-justified border-0 mt-2 mb-3" id="assistTabHead" role="tablist">
    <button
      class="nav-link active fw-bold text-uppercase py-2"
      id="assist-tab"
      data-bs-toggle="tab"
      data-bs-target="#assist-tab-pane"
      type="button"
      role="tab"
      aria-selected="true"
    >
      {{ t('FormSections.Assistances') }}
    </button>

    <button
      class="nav-link fw-bold text-uppercase py-2"
      id="bomb-tab"
      data-bs-toggle="tab"
      data-bs-target="#bomb-tab-pane"
      type="button"
      role="tab"
      aria-selected="true"
    >
      {{ t('FormSections.Firefighters') }}
    </button>

    <button
      class="nav-link fw-bold text-uppercase py-2"
      id="calif-tab"
      data-bs-toggle="tab"
      data-bs-target="#calif-tab-pane"
      type="button"
      role="tab"
      aria-selected="true"
    >
      {{ t('FormSections.Qualifications') }}
    </button>
  </nav>

  <div class="tab-content">
    <AssistGeneralTab :assist-all-det="assistAllDet" />

    <AssistBombTab :assist-bomb-list="assistBombList" :assist-all-det="assistAllDet" />

    <AssistCalifTab :assist-bomb-list="assistBombList" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AssistGeneralTab from '@/features/assistances/components/AssistGeneralTab.vue';
import AssistBombTab from '@/features/assistances/components/AssistBombTab.vue';
import AssistCalifTab from '@/features/assistances/components/AssistCalifTab.vue';
import type {
  AsistBombDetail,
  AsistGeneralData,
} from '@/features/assistances/interfaces/assistances.interfaces';

const { t } = useI18n();

defineProps<{
  assistBombList: AsistBombDetail[];
  assistAllDet: AsistGeneralData | null;
}>();
</script>
