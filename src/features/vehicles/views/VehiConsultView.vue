<template>
  <div class="container">
    <SectionTitle
      :title="t('VehiclesViews.ConsultTitle')"
      :subtitle="t('VehiclesViews.ConsultSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('VehiclesViews.MenuTitle'), link: '/vehicles' },
        { detail: t('VehiclesViews.ConsultTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2">
      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          @click="addVehi"
        />

        <BtnTable
          :activeBtn="activeVehi !== null"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          @click="editVehi"
        />

        <BtnTable
          :activeBtn="activeVehi !== null"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#vehiDeleteModal"
          @confirm="deleteVehi"
        />
      </div>

      <Table
        :tableHeads="tableHeads"
        :tableData="tableData"
        v-model:select-row-id="selectedRowId"
      />
    </div>

    <BtnBack :toHome="false" />

    <VehiDeleteModal :id="activeVehi?.id" @confirm="deleteVehi" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import Table from '@/shared/components/Table.vue';

import type { VehicleData } from '@/features/vehicles/interfaces/vehicles.interfaces';
import { getVehicles } from '@/features/vehicles/services/vehicles.action';
import VehiDeleteModal from '@/features/vehicles/components/VehiDeleteModal.vue';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const tableHeads = [
  t('FormField.InternalNum'),
  t('FormField.Mark'),
  t('FormField.Model'),
  t('FormField.Type'),
];
const tableData = ref<VehicleData[]>([]);
const activeVehi = ref<VehicleData | null>(null);
const selectedRowId = ref(0);

onMounted(async () => {
  await loadDataTable();
  desactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  activeVehi.value = null;

  const vehicles = await getVehicles();

  if (vehicles.ok && vehicles.data) {
    tableData.value = vehicles.data.map((vehicle: VehicleData) => ({
      id: vehicle.id,
      internalNumber: vehicle.internalNumber,
      mark: vehicle.mark,
      model: vehicle.model,
      vehicleType: vehicle.vehicleType,
    }));
  } else {
    toast.error(vehicles.message ?? t('Messages.ErrorLoading'));
  }
};

const addVehi = async () => {
  await router.push(`/vehicles/new`);
};

const editVehi = async () => {
  if (activeVehi.value) {
    await router.push(`/vehicles/${activeVehi.value.id}/edit`);
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const deleteVehi = async () => {
  activeSpinner(t('Messages.Loading'));
  await loadDataTable();
  desactivateSpinner();
};

watch(selectedRowId, (newId: number) => {
  activeVehi.value = tableData.value.find((tl) => tl.id === newId) || null;
});
</script>
