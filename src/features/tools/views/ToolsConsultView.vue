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
          @click="addTool"
        />

        <BtnTable
          :activeBtn="activeTool !== null"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          @click="editTool"
        />

        <BtnTable
          :activeBtn="activeTool !== null"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
        />
      </div>

      <Table :tableHeads="tableHeads" :tableData="tableData" @selectRow="changeSelecTable" />
    </div>

    <BtnBack :toHome="false" />
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { onMounted, reactive, ref } from 'vue';
import { useToast } from 'vue-toastification';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import Table from '@/shared/components/Table.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import type { ToolsData } from '@/features/tools/interfaces/tools.interfaces';
import { deleteTool, getTools } from '@/features/tools/services/tools.actions';
import ToolFilter from '@/features/tools/components/ToolFilter.vue';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();

const tableHeads = [
  t('FormField.Name'),
  t('FormField.Mark'),
  t('FormField.Count'),
  t('FormField.Type'),
];
const tableData = ref<ToolsData[]>([]);
const activeTool = ref<ToolsData | null>(null);

const currentFilters = reactive({
  inStock: null as boolean | null,
  type: null as number | null,
});

onMounted(async () => {
  await loadDataTable();
  desactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  activeTool.value = null;

  const tools = await getTools(currentFilters.type, currentFilters.inStock);

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

const changeSelecTable = (tableId: number) => {
  activeTool.value = tableData.value.find((tl) => tl.id === tableId) || null;
};

const filterData = async (stock: number | null, type: number | null) => {
  currentFilters.inStock = stock === 1 ? null : stock === 2 ? true : false;
  currentFilters.type = type === 9999 ? null : type;

  activeSpinner(t('Messages.Filter'));
  await loadDataTable();
  desactivateSpinner();
};

const addTool = async () => {
  //ver accion
};

const editTool = async () => {
  if (activeTool.value) {
    //ver accion
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const delTool = async () => {
  if (activeTool.value) {
    activeSpinner(t('Messages.Delete'));

    const result = await deleteTool(activeTool.value.id, 1, 'delete');

    if (result.ok) {
      toast.success(result.message);
      document.getElementById('closevalidActionModal')?.click();
      await loadDataTable();
    } else {
      toast.error(result.message || t('Messages.ErrorDelete'));
    }

    desactivateSpinner();
  }
};
</script>
