<template>
  <div class="tab-pane fade show active" id="assist-tab-pane" role="tabpanel" tabindex="0">
    <div class="card bg-dark-custom border-light-subtle p-4">
      <h4 class="text-white mb-4 fw-bold text-orange-fire">
        {{ t('AssistanceViews.GlobalSummary') }}
      </h4>

      <div
        v-if="!props.assistAllDet || props.assistAllDet.asistDetail.length === 0"
        class="text-center p-5 text-secondary"
      >
        {{ t('AssistanceViews.NoRecords') }}
      </div>

      <div v-else class="row align-items-center">
        <div class="col-12 col-md-5 d-flex justify-content-center mb-4 mb-md-0 position-relative">
          <div class="chart-container">
            <Doughnut :data="chartData" :options="chartOptions" />
            <div class="chart-center-text text-center position-absolute">
              <span class="fs-1 fw-bold text-white d-block lh-1">{{ totalGlobal }}</span>
              <small class="text-secondary text-uppercase fw-semibold tracking-wider">
                {{ t('FormField.Totals') }}
              </small>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-7">
          <div class="d-flex flex-column gap-2 ps-md-4">
            <div
              v-for="item in leyendaDatos"
              :key="item.typeId"
              class="d-flex align-items-center justify-content-between p-2 px-3 rounded bg-dark-card border border-secondary-subtle hover-scale"
            >
              <div class="d-flex align-items-center gap-2">
                <span class="dot-indicator" :style="{ backgroundColor: item.color }"></span>
                <span class="fw-semibold text-white">{{ item.label }}</span>
              </div>

              <div class="d-flex align-items-center gap-3">
                <span class="fs-5 fw-bold text-white">{{ item.cantidad }}</span>
                <span
                  class="badge fw-bold px-2 py-1"
                  :style="{
                    backgroundColor: item.bgColorBadge,
                    color: item.color,
                    minWidth: '45px',
                  }"
                >
                  {{ item.porcentaje }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { useI18n } from 'vue-i18n';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ScriptableTooltipContext,
} from 'chart.js';

import type { AsistGeneralData } from '@/features/assistances/interfaces/assistances.interfaces';

ChartJS.register(ArcElement, Tooltip, Legend);
const { t } = useI18n();

const props = defineProps<{
  assistAllDet: AsistGeneralData | null;
}>();

const colorList: string[] = ['#fd7e14', '#ffc107', '#00bfff', '#198754', '#a855f7', '#adb5bd'];

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const totalGlobal = computed(() => props.assistAllDet?.totalQuantity || 0);

const itemsProcesados = computed(() => {
  if (!props.assistAllDet?.asistDetail) return [];

  return props.assistAllDet.asistDetail.map((detail, index) => {
    const colorAsignado = colorList[index % colorList.length];

    return {
      typeId: detail.typeId,
      label: detail.typeName,
      cantidad: detail.quantity,
      porcentaje: detail.quantityPerc,
      color: colorAsignado,
      bgColorBadge: hexToRgba(colorAsignado, 0.12),
    };
  });
});

const chartData = computed(() => {
  return {
    labels: itemsProcesados.value.map((item) => item.label),
    datasets: [
      {
        data: itemsProcesados.value.map((item) => item.cantidad),
        backgroundColor: itemsProcesados.value.map((item) => item.color),
        borderColor: '#1e1e2f',
        borderWidth: 3,
        hoverOffset: 6,
        borderRadius: 4,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '78%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#2a2a3e',
      titleColor: '#fff',
      bodyColor: '#b5b5c3',
      borderColor: (context: ScriptableTooltipContext<'doughnut'>) => {
        const labelColors = context.tooltip?.labelColors?.[0];
        return labelColors ? (labelColors.backgroundColor as string) : '#fd7e14';
      },
      borderWidth: 1,
      padding: 10,
      displayColors: false,
    },
  },
};

const leyendaDatos = computed(() => {
  if (!itemsProcesados.value) return [];

  const total = totalGlobal.value || 1;

  return itemsProcesados.value.map((item) => {
    const porcentajeCalculado = Math.round((item.cantidad / total) * 100);

    return {
      ...item,
      porcentaje: porcentajeCalculado,
    };
  });
});
</script>

<style scoped>
.bg-dark-custom {
  background-color: #1a1a24 !important;
}
.bg-dark-card {
  background-color: #252538 !important;
}
.chart-container {
  width: 240px;
  height: 240px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chart-center-text {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.dot-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.tracking-wider {
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}
.hover-scale {
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}
.hover-scale:hover {
  transform: translateX(4px);
  border-color: rgba(255, 255, 255, 0.25) !important;
}
</style>
