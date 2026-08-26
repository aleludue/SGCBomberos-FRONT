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
      <ToolFilter @applyFilter="filterData" />

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
import { onMounted, reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import Table from '@/shared/components/Table.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import type { ToolsData } from '@/features/tools/interfaces/tools.interfaces';
import { getTools } from '@/features/tools/services/tools.actions';
import ToolFilter from '@/features/tools/components/ToolFilter.vue';
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
const toolsTypeList = ref<{ id: number; name: string }[]>([]);
const selectedRowId = ref(0);

const currentFilters = reactive({
  inStock: null as boolean | null,
  type: null as number | null,
  searchTerm: '' as string,
});

onMounted(async () => {
  await loadDataTable();

  toolsTypeList.value = [];
  const { ok, data } = await getToolTypes();

  if (ok && data) {
    toolsTypeList.value = [
      ...data.map((type) => ({
        id: type.id,
        name: type.name,
      })),
    ];
  }

  desactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  activeTool.value = null;

  const tools = await getTools(
    currentFilters.type,
    currentFilters.inStock,
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

const filterData = async (stock: number | null, type: number | null, searchTerm: string | null) => {
  currentFilters.inStock = stock === 1 ? null : stock === 2 ? true : false;
  currentFilters.type = type === 9999 ? null : type;
  currentFilters.searchTerm = searchTerm ?? '';

  activeSpinner(t('Messages.Filter'));
  await loadDataTable();
  desactivateSpinner();
};

const clearSelectedTool = async () => {
  activeTool.value = null;
  selectedRowId.value = 0;
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

watch(selectedRowId, (newId: number) => {
  activeTool.value = tableData.value.find((tl) => tl.id === newId) || null;
});
</script>
