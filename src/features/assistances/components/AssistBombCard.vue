<template>
  <div v-if="bombDetail && generalDetail" class="col-12 col-md-6 col-xl-4 mt-3">
    <div
      class="card h-100 border border-secondary border-opacity-25 shadow-sm text-light transition-hover"
      style="background-color: #1e1e1e; border-radius: 12px"
    >
      <div class="card-body p-4">
        <h5 class="fw-bold mb-2 text-uppercase text-orange-fire">
          {{ bombDetail.fullName }}
        </h5>

        <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-b-custom">
          <div
            class="d-flex align-items-center justify-content-center rounded-circle border border-secondary border-opacity-50 text-warning fw-bold fs-5"
            style="width: 48px; height: 48px; background-color: #2b2b2b; min-width: 48px"
          >
            {{ bombDetail.internalNumber }}
          </div>

          <div class="d-flex flex-wrap">
            <p class="card-text small text-muted mb-0 me-2">
              {{ t('FormField.Count') }}:
              <span class="fw-semibold text-light">
                {{ bombDetail.totalQuantity }} / {{ generalDetail.totalQuantity }} -
                {{ bombDetail.totalQuantityPerc }}%</span
              >
            </p>

            <p class="card-text small text-muted mb-0 me-2">
              {{ t('FormField.Minutes') }}:
              <span class="fw-semibold text-light">
                {{ bombDetail.totalMinutes }} / {{ generalDetail.totalMinutes }} -
                {{ bombDetail.totalMinutesPerc }}%</span
              >
            </p>

            <p class="card-text small text-muted mb-0 me-2">
              {{ t('FormField.Qualification') }}:
              <span class="fw-semibold text-light">
                {{ bombDetail.totalQuantityPerc }}% - {{ bombDetail.calification }}</span
              >
            </p>
          </div>
        </div>

        <div class="d-flex flex-column gap-3" v-if="bombDetail.asistDetail.length > 0">
          <div v-for="(assistDet, index) in bombDetail.asistDetail" v-bind:key="index">
            <div class="text-light-muted mb-1 small fw-medium d-flex align-items-center gap-2">
              <span
                class="rounded-circle d-inline-block"
                style="width: 8px; height: 8px"
                :style="{ backgroundColor: getColor(index) }"
              ></span>
              {{ assistDet.typeName }} - {{ assistDet.quantity }} /
              {{ generalDetail.asistDetail.find((x) => x.typeId == assistDet.typeId)?.quantity }}
            </div>
            <div class="d-flex align-items-center gap-3">
              <div
                class="progress flex-grow-1"
                style="
                  height: 8px;
                  background-color: rgba(255, 255, 255, 0.08);
                  border-radius: 20px;
                "
              >
                <div
                  class="progress-bar"
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
                class="fw-bold"
                style="font-size: 0.85rem; min-width: 35px; text-align: right"
                :style="{ color: getColor(index) }"
              >
                {{ assistDet.quantityPerc }}%
              </span>
            </div>
          </div>
        </div>

        <div v-else>
          <div
            class="d-flex flex-column align-items-center justify-content-center my-auto py-4 px-2 border border-secondary border-opacity-10 border-dashed rounded-3"
            style="background-color: rgba(255, 255, 255, 0.01)"
          >
            <div
              class="d-flex align-items-center justify-content-center rounded-circle mb-3"
              style="
                width: 42px;
                height: 42px;
                background-color: rgba(255, 255, 255, 0.03);
                border: 1px dashed rgba(255, 255, 255, 0.1);
              "
            >
              <span class="text-muted small" style="font-size: 0.75rem">0%</span>
            </div>
            <p class="mb-1 fw-medium text-center" style="font-size: 0.85rem; color: #adb5bd">
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
.border-b-custom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.transition-hover {
  transition: border-color 0.2s ease-in-out;
}
.transition-hover:hover {
  border-color: rgba(253, 126, 20, 0.4) !important;
}
</style>
