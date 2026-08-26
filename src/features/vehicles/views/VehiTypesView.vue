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
          data-bs-target="#vehiTypeDeleteModal"
        />
      </div>

      <Table
        :tableHeads="tableHeads"
        :tableData="tableData"
        v-model:select-row-id="selectedRowId"
      />
    </div>

    <BtnBack :toHome="false" />

    <ModalBase
      ref="vehiTypeDeleteModalRef"
      :title-text="t('VehiclesViews.TypesDeleteTitle')"
      modal-name="vehiTypeDeleteModal"
      @confirm="deleteVehiType"
    >
      <p class="m-0 text-secondary-themed fw-medium">
        {{ t('VehiclesViews.TypesDeleteMessage') }}
      </p>
    </ModalBase>

    <ModalBase
      ref="vehiTypeModalRef"
      :title-text="t('FormField.FingerPrint')"
      modal-name="vehiTypeModal"
      form-name="vehiTypeForm"
      btn-type="submit"
      :btn-text="isNewVehiType ? t('Buttons.Save') : t('Buttons.Update')"
    >
      <form @submit.prevent="saveChangeVehiType" id="vehiTypeForm" class="row g-3">
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
      </form>
    </ModalBase>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';

import Table from '@/shared/components/Table.vue';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import ModalBase from '@/shared/components/ModalBase.vue';
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
const selectedRowId = ref(0);
const vehiTypeDeleteModalRef = ref<InstanceType<typeof ModalBase> | null>(null);
const vehiTypeModalRef = ref<InstanceType<typeof ModalBase> | null>(null);

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

  if (vehicleTypes.ok) {
    if (vehicleTypes.data) {
      tableData.value = vehicleTypes.data.map((type: VehicleTypeData) => ({
        id: type.id,
        name: type.name,
        detail: type.detail == null || type.detail === '' ? '-' : type.detail,
        cantVehicles: type.cantVehicles,
      }));
    }
  } else {
    toast.error(vehicleTypes.message ?? t('Messages.ErrorLoading'));
  }
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
    vehiTypeModalRef.value?.close();
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
      vehiTypeDeleteModalRef.value?.close();
      await loadDataTable();
    } else {
      toast.error(result.message || t('Messages.ErrorDelete'));
    }

    desactivateSpinner();
  }
};

watch(selectedRowId, (newId: number) => {
  activeVehiType.value = tableData.value.find((tl) => tl.id === newId) || null;
});
</script>
