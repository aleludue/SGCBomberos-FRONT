<template>
  <div class="tab-pane fade px-1" id="maint-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column gap-2">
      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          @click="addVehiMaint"
        />

        <BtnTable
          :activeBtn="activeVehiMaint !== null"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          @click="editVehiMaint"
        />

        <BtnTable
          :activeBtn="activeVehiMaint !== null"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#validActionModal"
        />
      </div>

      <Table :tableHeads="tableHeads" :tableData="tableData" @selectRow="changeSelecTable" />
    </div>

    <ModalValidAction
      :titleText="t('VehiclesViews.DeleteMaintenanceTitle')"
      :bodyText="t('VehiclesViews.DeleteMaintenanceMessage')"
      @confirm="deleteVehiMaint"
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

import { getVehicleMaintenanceDetails } from '@/features/vehicles/services/vehicles.action';
import type { VehicleMaintenanceData } from '@/features/vehicles/interfaces/vehicles.interfaces';
import { isoToLocalDate } from '@/shared/utils/genericFuntions';

const { t } = useI18n();
const toast = useToast();

const props = withDefaults(
  defineProps<{
    id: number;
  }>(),
  {
    id: 0,
  },
);

const emit = defineEmits<{
  maintCant: [maintQuantity: number];
}>();

const tableHeads = [t('FormField.RealizationDate'), t('FormField.Description')];
const tableData = ref<VehicleMaintenanceData[]>([]);
const activeVehiMaint = ref<VehicleMaintenanceData | null>(null);

onMounted(async () => {
  if (props.id === 0) {
    return;
  }

  await loadDataTable();
});

const loadDataTable = async () => {
  const { ok, data, message } = await getVehicleMaintenanceDetails(props.id);

  if (ok) {
    if (data) {
      tableData.value = data.map((maint: VehicleMaintenanceData) => ({
        id: maint.id,
        maintenanceDate: isoToLocalDate(maint.maintenanceDate),
        description: maint.description,
      }));

      emit('maintCant', tableData.value.length);
    }
  } else {
    toast.error(message ?? t('Messages.ErrorLoading'));
  }
};

const changeSelecTable = (tableId: number) => {
  activeVehiMaint.value = tableData.value.find((veh) => veh.id === tableId) || null;
};

const addVehiMaint = () => {};

const editVehiMaint = () => {};

const deleteVehiMaint = () => {};
</script>
