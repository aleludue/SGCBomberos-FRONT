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
          data-bs-target="#vehiTypeModal"
          @click="addVehiType"
        />

        <BtnTable
          :activeBtn="activeVehiType !== null"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          data-bs-toggle="modal"
          data-bs-target="#vehiTypeModal"
          @click="editVehiType"
        />

        <BtnTable
          :activeBtn="activeVehiType !== null"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#validActionModal"
        />
      </div>

      <Table :tableHeads="tableHeads" :tableData="tableData" @selectRow="changeSelecTable" />
    </div>

    <BtnBack :toHome="false" />

    <ModalValidAction
      :titleText="t('VehiclesViews.TypesDeleteTitle')"
      :bodyText="t('VehiclesViews.TypesDeleteMessage')"
      @confirm="deleteVehiType"
    />

    <div
      class="modal fade"
      id="vehiTypeModal"
      tabindex="-1"
      aria-hidden="true"
      aria-labelledby="vehiTypeModalTitle"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div
          class="modal-content border border-secondary-subtle shadow-lg bg-body-tertiary custom-modal-tactical"
        >
          <div class="modal-header border-bottom border-secondary-subtle py-3 px-4">
            <h1
              id="vehiTypeModalTitle"
              class="modal-title fs-5 fw-bold text-body d-flex align-items-center gap-2"
            >
              <i class="bi bi-calendar-event text-orange-fire"></i>
              {{ t('VehiclesViews.VehiTypeModalTitle') }}
            </h1>
            <button
              type="button"
              class="btn-close btn-close-themed"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <form @submit.prevent="saveChangeVehiType" id="vehiTypeForm" class="row g-3">
            <div class="modal-body py-4 px-4 text-body">
              <div class="row g-3">
                <FieldText
                  :label-text="t('FormField.Name')"
                  field-name="modalVehiTypeName"
                  :is-required="true"
                  :max-length="100"
                  :is-login-form="true"
                  v-model:text-det="modalRegDetail.name"
                />

                <FieldText
                  :label-text="t('FormField.Detail')"
                  field-name="modalVehiTypeDetail"
                  :is-textarea="true"
                  v-model:text-det="modalRegDetail.detail"
                  :is-required="false"
                  :max-length="250"
                  :is-login-form="true"
                />
              </div>
            </div>
          </form>

          <div
            class="modal-footer border-top border-secondary-subtle py-3 px-4 d-flex justify-content-end gap-2"
          >
            <button
              id="closeModalNewEdit"
              type="button"
              class="btn btn-sm btn-outline-secondary px-3"
              data-bs-dismiss="modal"
            >
              {{ $t('Buttons.Close') }}
            </button>
            <BtnConfirm type="submit" form="vehiTypeForm" class="px-4 fw-bold shadow-sm">
              <i class="bi bi-check-circle me-1"></i>
              {{ isNewVehiType ? $t('Buttons.Save') : $t('Buttons.Update') }}
            </BtnConfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';

import Table from '@/shared/components/Table.vue';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import ModalValidAction from '@/shared/components/ModalValidAction.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import {
  deleteVehicleType,
  getVehicleTypes,
  saveVehicleType,
  updateVehicleType,
} from '@/features/vehicles/services/vehicleType.action';
import type { VehicleTypeData } from '@/features/vehicles/interfaces/vehicles.interfaces';

const { desactivateSpinner, activeSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();
const { handleSubmit } = useForm();

const tableHeads = [t('FormField.Name'), t('FormField.Detail'), t('VehiclesViews.VehiCount')];
const tableData = ref<VehicleTypeData[]>([]);
const activeVehiType = ref<VehicleTypeData | null>(null);
const isNewVehiType = ref(false);
const modalRegDetail = ref<VehicleTypeData>({
  id: 0,
  name: '',
  detail: '',
  cantVehicles: 0,
});

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
      detail: type.detail == null || type.detail === '' ? '-' : type.detail,
      cantVehicles: type.cantVehicles,
    }));
  } else {
    toast.error(vehicleTypes.message ?? t('Messages.ErrorLoading'));
  }
};

const changeSelecTable = (tableId: number) => {
  activeVehiType.value = tableData.value.find((type) => type.id === tableId) || null;
};

const addVehiType = () => {
  isNewVehiType.value = true;
  modalRegDetail.value = {
    id: 0,
    name: '',
    detail: '',
    cantVehicles: 0,
  };
};

const editVehiType = () => {
  if (activeVehiType.value) {
    isNewVehiType.value = false;
    modalRegDetail.value.id = activeVehiType.value.id;
    modalRegDetail.value.name = activeVehiType.value.name;
    modalRegDetail.value.detail =
      activeVehiType.value.detail === '-' ? '' : activeVehiType.value.detail;
  }
};

const saveChangeVehiType = handleSubmit(async () => {
  activeSpinner(t('Messages.Update'));

  const { ok, message } = isNewVehiType.value
    ? await saveVehicleType(modalRegDetail.value.name, modalRegDetail.value.detail || '')
    : await updateVehicleType(
        modalRegDetail.value.id,
        modalRegDetail.value.name,
        modalRegDetail.value.detail || '',
      );

  if (ok) {
    toast.success(message);
    document.getElementById('closeModalNewEdit')?.click();
    await loadDataTable();
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});

const deleteVehiType = async () => {
  if (activeVehiType.value) {
    activeSpinner(t('Messages.Delete'));

    const result = await deleteVehicleType(activeVehiType.value.id);

    if (result.ok) {
      toast.success(result.message);
      document.getElementById('closeValidActionModal')?.click();
      await loadDataTable();
    } else {
      toast.error(result.message || t('Messages.ErrorDelete'));
    }

    desactivateSpinner();
  }
};
</script>

<style scoped>
.modal-body :deep(.form-control:focus) {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--brand-primary-rgb), 0.15) !important;
}
</style>
