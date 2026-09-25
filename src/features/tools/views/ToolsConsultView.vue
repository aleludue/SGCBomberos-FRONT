<template>
  <div class="container">
    <SectionTitle
      :title="t('ToolsViews.ConsultTitle')"
      :subtitle="t('ToolsViews.ConsultSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('ToolsViews.MenuTitle'), link: '/tools' },
        { detail: t('ToolsViews.ConsultTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2">
      <Filter
        :active-filters-count="activeFiltersCount"
        @clear-filter="filterClear"
        @apply-filter="filterTool"
      >
        <div class="row g-3">
          <FieldText
            :label-text="$t('FormField.Name') + ' / ' + $t('FormField.Mark')"
            v-model:text-det="currentFilters.searchTerm"
            field-name="filterNameMark"
          />

          <FieldSelector
            :label-text="$t('FormField.Status')"
            :options-list="stockList"
            field-name="filterStatus"
            v-model:option="currentFilters.inStock"
            :can-clear="false"
          />

          <FieldSelector
            :label-text="$t('FormField.Type')"
            :options-list="toolsTypeList"
            field-name="filterToolsType"
            v-model:option="currentFilters.type"
            :can-clear="false"
          />
        </div>
      </Filter>

      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          @click="clearSelectedTool"
          data-bs-toggle="modal"
          data-bs-target="#toolManageModal"
        />

        <BtnTable
          :activeBtn="activeTool !== null"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          data-bs-toggle="modal"
          data-bs-target="#toolManageModal"
        />

        <BtnTable
          :activeBtn="activeTool !== null"
          btnClass="btn-action-info"
          icon="bi-bar-chart-steps"
          :text="t('Buttons.StockMovements')"
          @click="goToolMovements"
        />
      </div>

      <Table
        :tableHeads="tableHeads"
        :tableData="tableData"
        v-model:select-row-id="selectedRowId"
      />
    </div>

    <BtnBack :toHome="false" />

    <ToolManageModal
      :id="activeTool?.id"
      :tool-det="activeTool"
      :type-list="toolsTypeList"
      @confirm="modalResult"
      @cancel="clearSelectedTool"
    />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import Table from '@/shared/components/Table.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import Filter from '@/shared/components/Filter.vue';
import { genericOptionsList } from '@/shared/composables/genericOptionList';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';

import type { ToolsData } from '@/features/tools/interfaces/tools.interfaces';
import { getTools } from '@/features/tools/services/tools.actions';
import ToolManageModal from '@/features/tools/components/ToolManageModal.vue';
import { getToolTypes } from '@/features/tools/services/toolType.action';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const tableHeads = [
  t('FormField.Name'),
  t('FormField.Mark'),
  t('FormField.Count'),
  t('FormField.Type'),
];
const tableData = ref<ToolsData[]>([]);
const activeTool = ref<ToolsData | null>(null);
const allToolsTypes = { id: '9999', name: t('SelectOptions.All') };
const toolsTypeList = ref<{ id: string; name: string }[]>([allToolsTypes]);
const selectedRowId = ref('');
const stockList = genericOptionsList().stockList;

const currentFilters = reactive({
  inStock: 1 as number,
  type: '9999' as string,
  searchTerm: '' as string,
});

onMounted(async () => {
  await loadDataTable();

  toolsTypeList.value = [allToolsTypes];
  const { ok, data } = await getToolTypes();

  if (ok && data) {
    toolsTypeList.value = [
      allToolsTypes,
      ...data.map((type) => ({
        id: type.id,
        name: type.name,
      })),
    ];
  }

  desactivateSpinner();
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (currentFilters.inStock !== 1) count++;
  if (currentFilters.type !== '9999') count++;
  if (currentFilters.searchTerm.trim() !== '') count++;
  return count;
});

const loadDataTable = async () => {
  tableData.value = [];
  activeTool.value = null;

  const tools = await getTools(
    currentFilters.type === '9999' ? null : currentFilters.type,
    currentFilters.inStock === 1 ? null : currentFilters.inStock === 2 ? true : false,
    currentFilters.searchTerm,
  );

  if (tools.ok) {
    if (tools.data) {
      tableData.value = tools.data.map((tool: ToolsData) => ({
        id: tool.id,
        name: tool.name,
        mark: tool.mark,
        quantity: tool.quantity,
        toolType: tool.toolType,
      }));
    }
  } else {
    toast.error(tools.message ?? t('Messages.ErrorLoading'));
  }
};

const clearSelectedTool = async () => {
  activeTool.value = null;
  selectedRowId.value = '';
};

const goToolMovements = async () => {
  if (activeTool.value) {
    await router.push(`/tools/${activeTool.value.id}/movements`);
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const modalResult = async () => {
  activeSpinner(t('Messages.Loading'));
  await loadDataTable();
  desactivateSpinner();
};

const filterClear = () => {
  currentFilters.inStock = 1;
  currentFilters.type = '9999';
  currentFilters.searchTerm = '';
  filterTool();
};

const filterTool = async () => {
  activeSpinner(t('Messages.Filter'));
  await loadDataTable();
  desactivateSpinner();
};

watch(selectedRowId, (newId: string) => {
  activeTool.value = tableData.value.find((tl) => tl.id === newId) || null;
});
</script>
