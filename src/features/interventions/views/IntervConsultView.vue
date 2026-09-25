<template>
  <div class="container">
    <SectionTitle
      :title="$t('InterventionViews.ConsultTitle')"
      :subtitle="$t('InterventionViews.ConsultSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('InterventionViews.MenuTitle'), link: '/interventions' },
        { detail: $t('InterventionViews.ConsultTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2">
      <Filter
        :active-filters-count="activeFiltersCount"
        @clear-filter="filterClear"
        @apply-filter="filterInterv"
      >
        <div class="row g-3">
          <FieldDate
            :label-text="t('FormField.DateFrom')"
            v-model:date-val="currentFilters.dateFrom"
            :max-date="new Date()"
          />

          <FieldDate
            :label-text="t('FormField.DateTo')"
            v-model:date-val="currentFilters.dateTo"
            :min-date="currentFilters.dateFrom"
            :max-date="new Date()"
          />

          <FieldSelector
            :label-text="$t('FormField.Status')"
            :options-list="statusList"
            field-name="filterStatus"
            v-model:option="currentFilters.status"
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
          @click="addInterv"
        />

        <BtnTable
          :activeBtn="
            selectedRowId !== '' &&
            tableData.find((x) => x.id == selectedRowId)?.status == 'Borrador'
          "
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          @click="editInterv"
        />

        <BtnTable
          :activeBtn="
            selectedRowId !== '' &&
            tableData.find((x) => x.id == selectedRowId)?.status == 'Borrador'
          "
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#intervDeleteModal"
        />

        <BtnTable
          :activeBtn="
            selectedRowId !== '' &&
            tableData.find((x) => x.id == selectedRowId)?.status != 'Borrador'
          "
          btnClass="btn-action-info"
          icon="bi-eye"
          :text="t('Buttons.Show')"
          @click="showInterv"
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
      ref="intervDeleteModalRef"
      :title-text="t('InterventionViews.IntervDeleteTitle')"
      modal-name="intervDeleteModal"
      @confirm="delInterv"
      @cancel="clearSelect"
    >
      <p class="m-0 text-secondary-themed fw-medium">
        {{ t('InterventionViews.IntervDeleteMessage') }}
      </p>
    </ModalBase>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import Table from '@/shared/components/Table.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import ModalBase from '@/shared/components/ModalBase.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import Filter from '@/shared/components/Filter.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';

import type { IntervData } from '@/features/interventions/interfaces/interventions.interfaces';
import {
  deleteIntervention,
  getInterventions,
} from '@/features/interventions/services/interventions.action';
import { genericOptionsList } from '@/shared/composables/genericOptionList';
import { isoToLocalDate } from '@/shared/utils/genericFuntions';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const tableHeads = [
  t('FormField.ActNumber'),
  t('FormField.Status'),
  t('FormField.TypeSinister'),
  t('FormField.Date'),
  t('FormField.CommandChief'),
];
const tableData = ref<IntervData[]>([]);
const selectedRowId = ref('');
const intervDeleteModalRef = ref<InstanceType<typeof ModalBase> | null>(null);
const statusList = genericOptionsList().intervStatusList;

const currentFilters = reactive({
  status: 'All',
  dateFrom: undefined as Date | undefined,
  dateTo: undefined as Date | undefined,
});

onMounted(async () => {
  await loadDataTable();
  desactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  selectedRowId.value = '';

  const { ok, data, message } = await getInterventions(
    false,
    currentFilters.status == 'All' ? null : currentFilters.status,
    currentFilters.dateFrom ?? null,
    currentFilters.dateTo ?? null,
  );

  if (ok) {
    if (data) {
      tableData.value = data.map((interv: IntervData) => ({
        id: interv.id,
        actNumber: interv.actNumber,
        status: interv.status,
        intervType: interv.intervType,
        date: isoToLocalDate(interv.date),
        commandChief: interv.commandChief,
      }));
    }
  } else {
    toast.error(message ?? t('Messages.ErrorLoading'));
  }
};

const addInterv = async () => {
  await router.push(`/interventions/new`);
};

const editInterv = async () => {
  if (selectedRowId.value !== '') {
    await router.push(`/interventions/${selectedRowId.value}/edit`);
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const showInterv = async () => {
  if (selectedRowId.value !== '') {
    await router.push(`/interventions/${selectedRowId.value}/detail`);
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const delInterv = async () => {
  if (selectedRowId.value) {
    activeSpinner(t('Messages.Delete'));

    const result = await deleteIntervention(selectedRowId.value);

    if (result.ok) {
      toast.success(result.message);
      intervDeleteModalRef.value?.close();
      await loadDataTable();
    } else {
      toast.error(result.message || t('Messages.ErrorDelete'));
    }

    desactivateSpinner();
  }
};

const clearSelect = () => {
  selectedRowId.value = '';
};

const activeFiltersCount = computed(() => {
  let count = 0;
  if (currentFilters.status !== 'All') count++;
  if (currentFilters.dateFrom !== undefined) count++;
  if (currentFilters.dateTo !== undefined) count++;
  return count;
});

const filterClear = () => {
  currentFilters.status = 'All';
  currentFilters.dateFrom = undefined;
  currentFilters.dateTo = undefined;
  filterInterv();
};

const filterInterv = async () => {
  activeSpinner(t('Messages.Filter'));
  await loadDataTable();
  desactivateSpinner();
};
</script>
