<template>
  <div class="tab-pane fade px-1" id="maint-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column gap-2">
      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          data-bs-toggle="modal"
          data-bs-target="#vehiMantModal"
          @click="addVehiMaint"
        />

        <BtnTable
          :activeBtn="activeVehiMaint !== null"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          data-bs-toggle="modal"
          data-bs-target="#vehiMantModal"
          @click="editVehiMaint"
        />

        <BtnTable
          :activeBtn="activeVehiMaint !== null"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#vehiMantDeleteModal"
        />
      </div>

      <Table
        :tableHeads="tableHeads"
        :tableData="tableData"
        v-model:select-row-id="selectedRowId"
      />
    </div>

    <ModalValidAction
      :titleText="t('VehiclesViews.DeleteMaintenanceTitle')"
      :bodyText="t('VehiclesViews.DeleteMaintenanceMessage')"
      modal-name="vehiMantDeleteModal"
      @confirm="deleteVehiMaint"
    />

    <div
      class="modal fade"
      id="vehiMantModal"
      tabindex="-1"
      aria-hidden="true"
      aria-labelledby="vehiMantModalTitle"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div
          class="modal-content border border-secondary-subtle shadow-lg bg-body-tertiary custom-modal-tactical"
        >
          <div class="modal-header border-bottom border-secondary-subtle py-3 px-4">
            <h1
              id="vehiMantModalTitle"
              class="modal-title fs-5 fw-bold text-body d-flex align-items-center gap-2"
            >
              <i class="bi bi-calendar-event text-orange-fire"></i>
              {{ t('VehiclesViews.VehiMantModalTitle') }}
            </h1>
            <button
              type="button"
              class="btn-close btn-close-themed"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <form @submit.prevent="saveVehiMant" id="vehiTypeForm" class="row g-3">
            <div class="modal-body py-4 px-4 text-body">
              <div class="row g-3">
                <FieldDate
                  :label-text="$t('FormField.RealizationDate')"
                  v-model:date-val="modalRegDetail.maintenanceDate"
                  :is-required="true"
                  :min-date="new Date(new Date().setFullYear(new Date().getFullYear() - 50))"
                  :max-date="new Date()"
                  :is-login-form="true"
                  field-name="modalVehiMantDate"
                />

                <FieldText
                  :label-text="t('FormField.Description')"
                  field-name="modalVehiMantDesc"
                  :is-required="true"
                  :max-length="500"
                  :is-login-form="true"
                  :is-textarea="true"
                  v-model:text-det="modalRegDetail.description"
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
              {{ isNewVehiTMant ? $t('Buttons.Save') : $t('Buttons.Update') }}
            </BtnConfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';

import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import ModalValidAction from '@/shared/components/ModalValidAction.vue';
import Table from '@/shared/components/Table.vue';
import { isoToLocalDate, localDateToIso } from '@/shared/utils/genericFuntions';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import {
  deleteVehicleMaintenance,
  getVehicleMaintenanceDetails,
  saveVehicleMaintenance,
  updateVehicleMaintenance,
} from '@/features/vehicles/services/vehicles.action';
import type { VehicleMaintenanceData } from '@/features/vehicles/interfaces/vehicles.interfaces';

const { t } = useI18n();
const toast = useToast();
const { desactivateSpinner, activeSpinner } = useSiteConfigStore();
const { handleSubmit } = useForm();

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
const isNewVehiTMant = ref(false);
const selectedRowId = ref(0);

const modalRegDetail = ref<VehicleMaintenanceData>({
  id: 0,
  description: '',
  maintenanceDate: '',
});

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

const addVehiMaint = () => {
  isNewVehiTMant.value = true;
  modalRegDetail.value = {
    id: 0,
    description: '',
    maintenanceDate: '',
  };
};

const editVehiMaint = () => {
  if (activeVehiMaint.value) {
    isNewVehiTMant.value = false;
    modalRegDetail.value.id = activeVehiMaint.value.id;
    modalRegDetail.value.description = activeVehiMaint.value.description;
    modalRegDetail.value.maintenanceDate = localDateToIso(activeVehiMaint.value.maintenanceDate);
  }
};

const saveVehiMant = handleSubmit(async () => {
  activeSpinner(t('Messages.Update'));

  const { ok, message } = isNewVehiTMant.value
    ? await saveVehicleMaintenance(
        props.id,
        modalRegDetail.value.maintenanceDate,
        modalRegDetail.value.description,
      )
    : await updateVehicleMaintenance(
        modalRegDetail.value.id,
        props.id,
        modalRegDetail.value.maintenanceDate,
        modalRegDetail.value.description,
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

const deleteVehiMaint = async () => {
  if (activeVehiMaint.value) {
    activeSpinner(t('Messages.Delete'));

    const result = await deleteVehicleMaintenance(activeVehiMaint.value.id, props.id);

    if (result.ok) {
      toast.success(result.message);
      document.getElementById('closevehiMantDeleteModal')?.click();
      await loadDataTable();
    } else {
      toast.error(result.message || t('Messages.ErrorDelete'));
    }

    desactivateSpinner();
  }
};

watch(selectedRowId, (newId: number) => {
  activeVehiMaint.value = tableData.value.find((tl) => tl.id === newId) || null;
});
</script>
