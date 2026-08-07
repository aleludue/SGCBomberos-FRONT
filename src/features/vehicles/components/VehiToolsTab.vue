<template>
  <div class="tab-pane fade px-1" id="tools-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column gap-2">
      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          @click="addVehiTool"
        />

        <BtnTable
          :activeBtn="activeVehiTool !== null"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          @click="editVehiTool"
        />

        <BtnTable
          :activeBtn="activeVehiTool !== null"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#vehiToolsDeleteModal"
        />
      </div>

      <Table :tableHeads="tableHeads" :tableData="tableData" @selectRow="changeSelecTable" />
    </div>

    <ModalValidAction
      :titleText="t('VehiclesViews.DeleteToolTitle')"
      :bodyText="t('VehiclesViews.DeleteToolMessage')"
      modal-name="vehiToolsDeleteModal"
      @confirm="delVehiTool"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import BtnTable from '@/shared/components/Button/BtnTable.vue';
import ModalValidAction from '@/shared/components/ModalValidAction.vue';
import Table from '@/shared/components/Table.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import {
  deleteVehicleTool,
  getVehicleToolsDetails,
} from '@/features/vehicles/services/vehicles.action';
import type { VehicleToolsData } from '@/features/vehicles/interfaces/vehicles.interfaces';

const { t } = useI18n();
const toast = useToast();
const { desactivateSpinner, activeSpinner } = useSiteConfigStore();

const props = withDefaults(
  defineProps<{
    id: number;
  }>(),
  {
    id: 0,
  },
);

const emit = defineEmits<{
  toolsCant: [toolsQuantity: number];
}>();

const tableHeads = [
  t('FormField.Name'),
  t('FormField.Mark'),
  t('FormField.ToolType'),
  t('FormField.Count'),
];
const tableData = ref<VehicleToolsData[]>([]);
const activeVehiTool = ref<VehicleToolsData | null>(null);

onMounted(async () => {
  if (props.id === 0) {
    return;
  }

  await loadDataTable();
});

const loadDataTable = async () => {
  const { ok, data, message } = await getVehicleToolsDetails(props.id);

  if (ok) {
    if (data) {
      tableData.value = data;
      emit('toolsCant', tableData.value.length);
    }
  } else {
    toast.error(message ?? t('Messages.ErrorLoading'));
  }
};

const changeSelecTable = (tableId: number) => {
  activeVehiTool.value = tableData.value.find((veh) => veh.id === tableId) || null;
};

const addVehiTool = () => {};

const editVehiTool = () => {};

const delVehiTool = async () => {
  if (activeVehiTool.value) {
    activeSpinner(t('Messages.Delete'));

    const result = await deleteVehicleTool(activeVehiTool.value.id, props.id, 1, '');

    if (result.ok) {
      toast.success(result.message);
      document.getElementById('closevehiToolsDeleteModal')?.click();
      await loadDataTable();
    } else {
      toast.error(result.message || t('Messages.ErrorDelete'));
    }

    desactivateSpinner();
  }
};
</script>
