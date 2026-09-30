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
      <Filter
        :active-filters-count="activeFiltersCount"
        @clear-filter="filterClear"
        @apply-filter="filterVehi"
      >
        <div class="row g-3">
          <FieldText
            :label-text="$t('FormField.Mark') + ' / ' + $t('FormField.Model')"
            v-model:text-det="currentFilters.searchTerm"
            field-name="filterNameMark"
          />

          <FieldNumber
            :label-text="$t('FormField.InternalNum')"
            v-model:num-val="currentFilters.internalNum"
            field-name="internalNum"
          />

          <FieldSelector
            :label-text="$t('FormField.Status')"
            :options-list="statusList"
            field-name="filterStatus"
            v-model:option="currentFilters.status"
            :can-clear="false"
          />

          <FieldSelector
            :label-text="$t('FormField.Type')"
            :options-list="vehiTypeList"
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
          @click="addVehi"
        />

        <BtnTable
          :activeBtn="selectedRowId !== ''"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          @click="editVehi"
        />

        <BtnTable
          :activeBtn="selectedRowId !== ''"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#vehiDeleteModal"
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
      ref="vehiDeleteModalRef"
      :title-text="t('VehiclesViews.DeleteTitle')"
      modal-name="vehiDeleteModal"
      form-name="vehiDeleteForm"
      btn-type="submit"
      :btn-text="t('Buttons.Save')"
      @cancel="resetModal"
    >
      <form @submit.prevent="confDelete" id="vehiDeleteForm" class="row g-3">
        <p>{{ t('VehiclesViews.DeleteMessage') }}</p>

        <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
          {{ t('VehiclesViews.DeleteActionWhitTools') }}
        </label>
        <div :id="uuid" class="col-12 row g-3 m-1 pe-2 d-flex flex-row">
          <div class="form-check mt-1">
            <input
              class="form-check-input"
              type="radio"
              name="stockRadio"
              id="radioToolStock"
              :value="true"
              v-model="stockModeSelect"
            />
            <label class="form-check-label" for="radioToolStock">
              {{ t('VehiclesViews.DeleteActionToolStock') }}
            </label>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="stockRadio"
              id="radioToolDelStock"
              :value="false"
              v-model="stockModeSelect"
            />
            <label class="form-check-label" for="radioToolDelStock">
              {{ t('VehiclesViews.DeleteActionToolDelete') }}
            </label>
          </div>
        </div>

        <FieldText
          :label-text="t('FormField.MoveStockDescription')"
          field-name="modalVehiDelMovDesc"
          :is-required="false"
          :max-length="150"
          :is-login-form="true"
          :is-textarea="true"
          v-model:text-det="vehiModalDet.movDescription"
        />
      </form>
    </ModalBase>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import { genericOptionsList } from '@/shared/composables/genericOptionList';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import Table from '@/shared/components/Table.vue';
import Filter from '@/shared/components/Filter.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import ModalBase from '@/shared/components/ModalBase.vue';

import type { VehicleData } from '@/features/vehicles/interfaces/vehicles.interfaces';
import { deleteVehicle, getVehicles } from '@/features/vehicles/services/vehicles.action';
import { getVehicleTypes } from '@/features/vehicles/services/vehicleType.action';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const { handleSubmit, resetForm } = useForm();

const tableHeads = [
  t('FormField.InternalNum'),
  t('FormField.Mark'),
  t('FormField.Model'),
  t('FormField.Type'),
];

const uuid = useId();
const tableData = ref<VehicleData[]>([]);
const selectedRowId = ref('');
const allVehiTypes = { id: '9999', name: t('SelectOptions.All') };
const vehiTypeList = ref<{ id: string; name: string }[]>([allVehiTypes]);
const statusList = genericOptionsList().statusList;
const stockModeSelect = ref<boolean>(true);
const vehiDeleteModalRef = ref<InstanceType<typeof ModalBase> | null>(null);

const currentFilters = reactive({
  type: '9999' as string,
  searchTerm: '' as string,
  internalNum: null as number | null,
  status: 1,
});

const vehiModalDet = reactive({
  movDescription: '',
});

onMounted(async () => {
  vehiTypeList.value = [allVehiTypes];
  const { ok, data } = await getVehicleTypes();

  if (ok && data) {
    vehiTypeList.value = [
      allVehiTypes,
      ...data.map((type) => ({
        id: type.id,
        name: type.name,
      })),
    ];
  }

  filterVehi();
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (currentFilters.internalNum !== null && currentFilters.internalNum > 0) count++;
  if (currentFilters.type !== '9999') count++;
  if (currentFilters.searchTerm.trim() !== '') count++;
  if (currentFilters.status !== 1) count++;
  return count;
});

const loadDataTable = async () => {
  tableData.value = [];
  selectedRowId.value = '';

  const vehicles = await getVehicles(
    currentFilters.searchTerm === '' ? null : currentFilters.searchTerm,
    currentFilters.type === '9999' ? null : currentFilters.type,
    currentFilters.status === 1 ? null : currentFilters.status === 2,
    currentFilters.internalNum === 0 || currentFilters.internalNum?.toString() === ''
      ? null
      : currentFilters.internalNum,
  );

  if (vehicles.ok) {
    tableData.value = vehicles.data ?? [];
  } else {
    toast.error(vehicles.message ?? t('Messages.ErrorLoading'));
  }
};

const addVehi = async () => {
  await router.push(`/vehicles/new`);
};

const editVehi = async () => {
  if (selectedRowId.value !== '') {
    await router.push(`/vehicles/${selectedRowId.value}/edit`);
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const filterClear = () => {
  currentFilters.internalNum = null;
  currentFilters.type = '9999';
  currentFilters.searchTerm = '';
  currentFilters.status = 1;
  activeSpinner(t('Messages.Filter'));
  filterVehi();
};

const filterVehi = async () => {
  await loadDataTable();
  desactivateSpinner();
};

const confDelete = handleSubmit(async () => {
  if (selectedRowId.value) {
    activeSpinner(t('Messages.Update'));

    const { ok, message } = await deleteVehicle(
      selectedRowId.value,
      stockModeSelect.value,
      vehiModalDet.movDescription,
    );

    if (ok) {
      toast.success(message);
      resetModal();
      vehiDeleteModalRef.value?.close();

      activeSpinner(t('Messages.Loading'));
      filterVehi();
    } else {
      toast.error(message || t('Messages.ErrorUpdate'));
    }

    desactivateSpinner();
  }
});

const resetModal = () => {
  stockModeSelect.value = true;
  vehiModalDet.movDescription = '';
  selectedRowId.value = '';
  resetForm();
};
</script>
