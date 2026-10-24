<template>
  <div class="container">
    <SectionTitle
      :title="t('AssistanceViews.ReportsTitle')"
      :subtitle="t('AssistanceViews.ReportsSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('AssistanceViews.MenuTitle'), link: '/assistances' },
        { detail: t('AssistanceViews.ReportsTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2">
      <Filter
        :active-filters-count="activeFiltersCount"
        :start-open="true"
        @clear-filter="filterClear"
        @apply-filter="filterAssist"
      >
        <div class="row g-3">
          <FieldNumber
            :label-text="$t('FormField.Year')"
            v-model:num-val="currentFilters.year"
            field-name="filterYear"
            :is-required="true"
            :max-value="new Date().getFullYear()"
          />

          <FieldSelector
            :label-text="$t('FormField.Firefighter')"
            :options-list="bombList"
            field-name="filterBombId"
            v-model:option="currentFilters.bombId"
          />
        </div>
      </Filter>
    </div>

    <NoRecordAlert v-if="assistBombList.length == 0" />
    <AssistTabs v-else :assist-bomb-list="assistBombList" :assist-all-det="assistAllDet" />

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import Filter from '@/shared/components/Filter.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import NoRecordAlert from '@/shared/components/NoRecordAlert.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { getBombInService } from '@/features/bomberos/services/bomberos.action';
import { getAssistReport } from '@/features/assistances/services/assistances.action';
import type {
  AsistBombDetail,
  AsistGeneralData,
} from '@/features/assistances/interfaces/assistances.interfaces';
import AssistTabs from '@/features/assistances/components/AssistTabs.vue';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();

const currentFilters = reactive({
  year: new Date().getFullYear() as number,
  bombId: '' as string | null,
});

const bombList = ref<{ id: string; name: string }[]>([]);
const assistAllDet = ref<AsistGeneralData | null>(null);
const assistBombList = ref<AsistBombDetail[]>([]);

onMounted(async () => {
  const { ok, data } = await getBombInService();

  if (ok && data) {
    data.forEach((bomb) => {
      bombList.value.push({
        id: bomb.id,
        name: bomb.internalNum + ' - ' + bomb.fullName,
      });
    });
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }

  desactivateSpinner();
});

const loadData = async () => {
  assistBombList.value = [];
  assistAllDet.value = null;

  const { ok, data, message } = await getAssistReport(
    currentFilters.year,
    currentFilters.bombId == '' ? null : currentFilters.bombId,
  );

  if (ok) {
    if (data) {
      assistAllDet.value = data.generalData;
      assistBombList.value = data.bombDetailList;
    }
  } else {
    toast.error(message ?? t('Messages.ErrorLoading'));
  }
};

const activeFiltersCount = computed(() => {
  let count = 0;
  if (currentFilters.year !== 0) count++;
  if (currentFilters.bombId !== '') count++;
  return count;
});

const filterClear = () => {
  currentFilters.year = new Date().getFullYear();
  currentFilters.bombId = '';
  assistBombList.value = [];
  assistAllDet.value = null;
};

const filterAssist = async () => {
  activeSpinner(t('Messages.Filter'));
  await loadData();
  desactivateSpinner();
};
</script>
