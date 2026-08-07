<template>
  <div class="container">
    <SectionTitle
      :title="t('ToolsViews.MovementsTitle')"
      :subtitle="t('ToolsViews.MovementsSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('ToolsViews.MenuTitle'), link: '/tools' },
        { detail: t('ToolsViews.MovementsTitle') },
      ]"
    />

    <div class="d-flex flex-column">
      <FormTitle :titleText="$t('FormSections.ToolDetails')" />

      <div class="row mb-3">
        <FieldReadOnly :label-text="$t('FormField.Name')" :valueText="toolDet.name" />
        <FieldReadOnly :label-text="$t('FormField.Mark')" :valueText="toolDet.mark" />
        <FieldReadOnly :label-text="$t('FormField.Type')" :valueText="toolDet.type" />
      </div>

      <FormTitle :titleText="$t('FormSections.ToolMovements')" />

      <Table :tableHeads="tableHeads" :tableData="movementsData" :can-select="false" />
    </div>

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import Table from '@/shared/components/Table.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { getToolsMovements } from '@/features/tools/services/tools.actions';
import type { ToolMovDetailsData } from '@/features/tools/interfaces/tools.interfaces';
import { isoToLocalDate } from '@/shared/utils/genericFuntions';

const { t } = useI18n();
const { desactivateSpinner } = useSiteConfigStore();
const route = useRoute();
const toast = useToast();

const toolDet = ref({
  name: '',
  mark: '',
  type: '',
});

const movementsData = ref<ToolMovDetailsData[]>([]);
const tableHeads = [
  t('FormField.Date'),
  t('FormField.MovementType'),
  t('FormField.Count'),
  t('FormField.Vehicle'),
  t('FormField.Description'),
];

onMounted(async () => {
  const { ok, data, message } = await getToolsMovements(route.params.id as string);

  if (ok && data) {
    toolDet.value.name = data.tool.name;
    toolDet.value.mark = data.tool.mark;
    toolDet.value.type = data.tool.toolType;

    movementsData.value = data.movements.map((entry) => ({
      id: entry.id,
      createdAt: isoToLocalDate(entry.createdAt),
      movementType: entry.movementType,
      quantity: entry.quantity,
      vehicle: entry.vehicle,
      description: entry.description || '-',
    }));
  } else {
    toast.error(message || t('Messages.ErrorLoading'));
  }

  desactivateSpinner();
});
</script>
