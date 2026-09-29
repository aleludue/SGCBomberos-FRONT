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

    <VehiDeleteModal :id="selectedRowId" @confirm="deleteVehi" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import Table from '@/shared/components/Table.vue';
import Filter from '@/shared/components/Filter.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';

import type { VehicleData } from '@/features/vehicles/interfaces/vehicles.interfaces';
import { getVehicles } from '@/features/vehicles/services/vehicles.action';
import VehiDeleteModal from '@/features/vehicles/components/VehiDeleteModal.vue';
import { getVehicleTypes } from '@/features/vehicles/services/vehicleType.action';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import { genericOptionsList } from '@/shared/composables/genericOptionList';

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
const selectedRowId = ref('');
const allVehiTypes = { id: '9999', name: t('SelectOptions.All') };
const vehiTypeList = ref<{ id: string; name: string }[]>([allVehiTypes]);
const statusList = genericOptionsList().statusList;

const currentFilters = reactive({
  type: '9999' as string,
  searchTerm: '' as string,
  internalNum: null as number | null,
  status: 1,
});

onMounted(async () => {
  await loadDataTable();

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

  desactivateSpinner();
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

const deleteVehi = async () => {
  activeSpinner(t('Messages.Loading'));
  await loadDataTable();
  desactivateSpinner();
};

const filterClear = () => {
  currentFilters.internalNum = null;
  currentFilters.type = '9999';
  currentFilters.searchTerm = '';
  currentFilters.status = 1;
  filterVehi();
};

const filterVehi = async () => {
  activeSpinner(t('Messages.Filter'));
  await loadDataTable();
  desactivateSpinner();
};
</script>
