<template>
  <div class="container">
    <SectionTitle
      :title="t('AssistanceViews.ConsultTitle')"
      :subtitle="t('AssistanceViews.ConsultSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('AssistanceViews.MenuTitle'), link: '/assistances' },
        { detail: $t('AssistanceViews.ConsultTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2">
      <Filter
        :active-filters-count="activeFiltersCount"
        @clear-filter="filterClear"
        @apply-filter="filterAssist"
      >
        <div class="row g-3">
          <FieldDate
            :label-text="t('FormField.DateFrom')"
            v-model:date-val="currentFilters.dateFrom"
            :max-date="new Date()"
            :is-required="true"
          />

          <FieldDate
            :label-text="t('FormField.DateTo')"
            v-model:date-val="currentFilters.dateTo"
            :min-date="currentFilters.dateFrom"
            :max-date="new Date()"
            :is-required="true"
          />

          <FieldSelector
            :label-text="$t('FormField.AssistType')"
            :options-list="typeList"
            field-name="filterTypeId"
            v-model:option="currentFilters.typeId"
          />
        </div>
      </Filter>

      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          @click="addAssist"
        />

        <BtnTable
          :activeBtn="selectedRowId !== ''"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          @applyAction="editAssist"
        />

        <BtnTable
          :activeBtn="selectedRowId !== ''"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#assistDeleteModal"
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
      ref="assistDeleteModalRef"
      :title-text="t('AssistanceViews.DeleteTitle')"
      modal-name="assistDeleteModal"
      @confirm="delAssist"
      @cancel="clearSelect"
    >
      <p class="m-0 text-secondary-themed fw-medium">
        {{ t('AssistanceViews.DeleteMessage') }}
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
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import Filter from '@/shared/components/Filter.vue';
import Table from '@/shared/components/Table.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import ModalBase from '@/shared/components/ModalBase.vue';

import { getAssistTypes } from '@/features/assistances/services/assistanceType.action';
import type { AssistData } from '@/features/assistances/interfaces/assistances.interfaces';
import { getAssistances } from '@/features/assistances/services/assistances.action';
import { isoToLocalDate } from '@/shared/utils/genericFuntions';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const typeList = ref<{ id: string; name: string }[]>([]);
const tableData = ref<AssistData[]>([]);
const selectedRowId = ref('');
const assistDeleteModalRef = ref<InstanceType<typeof ModalBase> | null>(null);

const currentFilters = reactive({
  typeId: '' as string | null,
  dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)) as Date,
  dateTo: new Date() as Date,
});

const tableHeads = [
  t('FormField.AssistType'),
  t('FormField.Date'),
  t('FormField.Duration'),
  t('FormField.BombCount'),
];

onMounted(async () => {
  const { ok, data } = await getAssistTypes();

  if (ok && data) {
    typeList.value = data?.map((type) => ({
      id: type.id,
      name: type.name,
    }));
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }

  await loadDataTable();
  desactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  selectedRowId.value = '';

  const { ok, data, message } = await getAssistances(
    currentFilters.typeId === '' ? null : currentFilters.typeId,
    currentFilters.dateFrom,
    currentFilters.dateTo,
  );

  if (ok) {
    if (data) {
      tableData.value = data.map((assist: AssistData) => ({
        id: assist.id,
        type: assist.type,
        date: isoToLocalDate(assist.date),
        duration: assist.duration,
        cantBomb: assist.cantBomb,
      }));
    }
  } else {
    toast.error(message ?? t('Messages.ErrorLoading'));
  }
};

const activeFiltersCount = computed(() => {
  let count = 0;
  if (currentFilters.typeId !== '') count++;
  if (currentFilters.dateFrom !== null) count++;
  if (currentFilters.dateTo !== null) count++;
  return count;
});

const filterClear = () => {
  currentFilters.typeId = '';
  currentFilters.dateFrom = new Date(new Date().setMonth(new Date().getMonth() - 1));
  currentFilters.dateTo = new Date();
  filterAssist();
};

const filterAssist = async () => {
  activeSpinner(t('Messages.Filter'));
  await loadDataTable();
  desactivateSpinner();
};

const addAssist = async () => {
  await router.push(`/assistances/new`);
};

const editAssist = async () => {
  if (selectedRowId.value) {
    await router.push(`/assistances/${selectedRowId.value}/edit`);
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const clearSelect = () => {
  selectedRowId.value = '';
};

const delAssist = async () => {
  if (selectedRowId.value) {
    activeSpinner(t('Messages.Delete'));

    // const {ok, message} = await deleteIntervention(selectedRowId.value);

    // if (ok) {
    //   toast.success(message);
    //   assistDeleteModalRef.value?.close();
    //   await loadDataTable();
    // } else {
    //   toast.error(message || t('Messages.ErrorDelete'));
    // }

    desactivateSpinner();
  }
};
</script>
