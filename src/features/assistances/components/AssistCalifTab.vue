<template>
  <div class="tab-pane fade" id="calif-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column gap-2">
      <Table :tableHeads="tableHeads" :tableData="tableData" :canSelect="false" viewMode="table" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import Table from '@/shared/components/Table.vue';

import type {
  AsistBombDetail,
  AssistCalifTable,
} from '@/features/assistances/interfaces/assistances.interfaces';

const { t } = useI18n();

const props = defineProps<{
  assistBombList: AsistBombDetail[];
}>();

const tableHeads = [
  t('FormField.InternalNum'),
  t('FormField.FullName'),
  t('FormField.Percentage'),
  t('FormField.Qualification'),
];

const tableData = computed<AssistCalifTable[]>(() => {
  const list = props.assistBombList;

  if (!list) return [];

  return list.map((assist) => ({
    id: assist.id,
    internalNumber: assist.internalNumber,
    fullName: assist.fullName,
    totalQuantityPerc: assist.totalQuantityPerc.toString() + '%',
    calification: assist.calification,
  }));
});
</script>
