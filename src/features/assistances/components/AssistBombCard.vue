<template>
  <div v-if="bombDetail && generalDetail" class="col-12 col-md-6 col-xl-4 mb-3">
    <div
      class="card h-100 border border-secondary border-opacity-25 shadow-sm text-body transition-hover custom-card"
      style="border-radius: 12px"
    >
      <div class="card-body p-3 d-flex flex-column">
        <h5 class="fw-bold text-uppercase text-orange-fire tracking-wide">
          {{ bombDetail.fullName }}
        </h5>

        <div
          class="d-flex align-items-center gap-3 p-2 px-4 mb-3 custom-header-block"
          style="margin-left: -1rem; margin-right: -1rem"
        >
          <div
            class="me-3 d-flex align-items-center justify-content-center rounded-circle border fw-bold fs-5 shadow-sm text-orange-fire custom-number-circle"
            style="width: 52px; height: 52px; min-width: 52px"
          >
            {{ bombDetail.internalNumber }}
          </div>

          <div class="d-flex flex-column gap-2 flex-grow-1">
            <div
              class="d-flex justify-content-between align-items-center border-bottom-dashed pb-1"
            >
              <span class="small text-muted fw-medium">{{ t('FormField.Count') }}:</span>
              <span class="small fw-bold text-body">
                {{ bombDetail.totalQuantity }}/{{ generalDetail.totalQuantity }}
                <span class="text-secondary fw-normal">({{ bombDetail.totalQuantityPerc }}%)</span>
              </span>
            </div>

            <div
              class="d-flex justify-content-between align-items-center border-bottom-dashed pb-1"
            >
              <span class="small text-muted fw-medium">{{ t('FormField.Minutes') }}:</span>
              <span class="small fw-bold text-body">
                {{ bombDetail.totalMinutes }}/{{ generalDetail.totalMinutes }}
              </span>
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <span class="small text-muted fw-medium">{{ t('FormField.Qualification') }}:</span>
              <span class="small fw-bold custom-calification-text">
                {{ bombDetail.calification }}
              </span>
            </div>
          </div>
        </div>

        <div class="d-flex flex-column gap-3 px-2" v-if="bombDetail.asistDetail.length > 0">
          <div v-for="(assistDet, index) in bombDetail.asistDetail" :key="index">
            <div
              class="text-body mb-1 small fw-semibold d-flex align-items-center justify-content-between"
            >
              <div class="d-flex align-items-center gap-2">
                <span
                  class="rounded-circle d-inline-block shadow-sm"
                  style="width: 10px; height: 10px"
                  :style="{ backgroundColor: getColor(index) }"
                ></span>
                <span>{{ assistDet.typeName }}</span>
              </div>
              <span class="text-muted fw-medium">
                {{ assistDet.quantity }} /
                {{ generalDetail.asistDetail.find((x) => x.typeId == assistDet.typeId)?.quantity }}
              </span>
            </div>

            <div class="d-flex align-items-center gap-3">
              <div
                class="progress flex-grow-1 custom-progress-track"
                style="height: 10px; border-radius: 20px"
              >
                <div
                  class="progress-bar shadow-sm"
                  role="progressbar"
                  :style="{
                    width: assistDet.quantityPerc + '%',
                    backgroundColor: getColor(index),
                    borderRadius: '20px',
                  }"
                  :aria-valuenow="assistDet.quantityPerc"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <span
                class="fw-bold fs-7"
                style="min-width: 38px; text-align: right"
                :style="{ color: getColor(index) }"
              >
                {{ assistDet.quantityPerc }}%
              </span>
            </div>
          </div>
        </div>

        <div v-else class="my-auto">
          <div
            class="d-flex flex-column align-items-center justify-content-center py-4 px-2 border border-secondary border-opacity-15 border-dashed rounded-3 custom-empty-state"
          >
            <span class="text-muted fw-bold mb-2 fs-4">0%</span>
            <p class="mb-0 fw-medium text-center small text-muted">
              {{ t('AssistanceViews.NoRecords') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type {
  AsistBombDetail,
  AsistGeneralData,
} from '@/features/assistances/interfaces/assistances.interfaces';

const { t } = useI18n();

withDefaults(
  defineProps<{
    bombDetail: AsistBombDetail | null;
    generalDetail?: AsistGeneralData | null;
  }>(),
  {
    bombDetail: null,
    generalDetail: null,
  },
);

const colorList: string[] = ['#fd7e14', '#ffc107', '#00bfff', '#198754', '#a855f7', '#adb5bd'];
const getColor = (index: number): string => {
  return colorList[index % colorList.length];
};
</script>

<style lang="css" scoped>
.custom-card {
  background-color: var(--card-bg-local) !important;
  overflow: hidden;
}

.custom-header-block {
  background-color: var(--header-block-bg) !important;
}

.custom-number-circle {
  background-color: var(--number-circle-bg) !important;
  border-color: var(--number-circle-border) !important;
}

.custom-progress-track {
  background-color: var(--progress-track-bg) !important;
}

.custom-empty-state {
  background-color: var(--header-block-bg);
}

.border-bottom-dashed {
  border-bottom: 1px dashed var(--dashed-border-color);
}

.fs-7 {
  font-size: 0.8rem;
}

.tracking-wide {
  letter-spacing: 0.03em;
}

.transition-hover {
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.transition-hover:hover {
  transform: translateY(-3px);
  border-color: rgba(253, 126, 20, 0.5) !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
}
</style>
