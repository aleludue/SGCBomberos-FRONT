<template>
  <div class="container">
    <SectionTitle
      :title="t('VehiclesViews.TypesTitle')"
      :subtitle="t('VehiclesViews.TypesSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('VehiclesViews.MenuTitle'), link: '/vehicles' },
        { detail: t('VehiclesViews.TypesTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2">
      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          data-bs-toggle="modal"
          data-bs-target="#historyModal"
          @click="addVehiType"
        />

        <BtnTable
          :activeBtn="activeVehiType !== null"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="$t('Buttons.Edit')"
          data-bs-toggle="modal"
          data-bs-target="#historyModal"
          @click="editVehiType"
        />

        <BtnTable
          :activeBtn="activeVehiType !== null"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="$t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#validActionModal"
        />
      </div>

      <Table :tableHeads="tableHeads" :tableData="tableData" @selectRow="changeSelecTable" />
    </div>

    <BtnBack :toHome="false" />

    <ModalValidAction
      :titleText="$t('VehiclesViews.TypesDeleteTitle')"
      :bodyText="$t('VehiclesViews.TypesDeleteMessage')"
      @confirm="deleteVehiType"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import Table from '@/shared/components/Table.vue';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import ModalValidAction from '@/shared/components/ModalValidAction.vue';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getVehicleTypes } from '@/features/vehicles/services/vehicleType.action';
import type { VehicleTypeData } from '@/features/vehicles/interfaces/vehicles.interfaces';

const { desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();

const tableHeads = [t('FormField.Name'), t('FormField.Detail')];
const tableData = ref<VehicleTypeData[]>([]);
const activeVehiType = ref<VehicleTypeData | null>(null);

onMounted(async () => {
  await loadDataTable();
  desactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  activeVehiType.value = null;

  const vehicleTypes = await getVehicleTypes();

  if (vehicleTypes.ok && vehicleTypes.data) {
    tableData.value = vehicleTypes.data.map((type: VehicleTypeData) => ({
      id: type.id,
      name: type.name,
      detail: type.detail,
    }));
  } else {
    toast.error(vehicleTypes.message ?? t('Messages.ErrorLoading'));
  }
};

const changeSelecTable = (tableId: number) => {
  activeVehiType.value = tableData.value.find((type) => type.id === tableId) || null;
};

const addVehiType = () => {};

const editVehiType = () => {};

const deleteVehiType = () => {};
</script>
