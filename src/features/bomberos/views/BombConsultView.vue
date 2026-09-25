<template>
  <div class="container">
    <SectionTitle
      :title="t('BomberosViews.ConsultTitle')"
      :subtitle="t('BomberosViews.ConsultSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('BomberosViews.MenuTitle'), link: '/bomberos' },
        { detail: $t('BomberosViews.ConsultTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2">
      <Filter
        :active-filters-count="activeFiltersCount"
        @clear-filter="filterClear"
        @apply-filter="filterBombs"
      >
        <div class="row g-3">
          <FieldText
            :label-text="$t('FormField.FullName')"
            v-model:text-det="currentFilters.fullName"
            field-name="filterFullName"
          />

          <FieldNumber
            :label-text="$t('FormField.InternalNum')"
            v-model:num-val="currentFilters.internalNumber"
            field-name="filterInterNumber"
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
          @click="addBomb"
        />

        <BtnTable
          :activeBtn="selectedRowId !== ''"
          btnClass="btn-action-manage"
          icon="bi-pen"
          :text="$t('Buttons.Manage')"
          @applyAction="editBomb"
        />

        <BtnTable
          :activeBtn="selectedRowId !== ''"
          btnClass="btn-action-edit"
          icon="bi-arrow-down-up"
          :text="$t('Buttons.ChangeStatus')"
          @applyAction="changeStatusBomb"
        />
      </div>

      <Table
        :tableHeads="tableHeads"
        :tableData="tableData"
        v-model:select-row-id="selectedRowId"
      />
    </div>

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import Table from '@/shared/components/Table.vue';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getRolesList } from '@/shared/services/generic.action';
import Filter from '@/shared/components/Filter.vue';
import { genericOptionsList } from '@/shared/composables/genericOptionList';

import { getInstitutionBomb, changeStatus } from '@/features/bomberos/services/bomberos.action';
import type {
  BombTableItem,
  InstBombDetail,
} from '@/features/bomberos/interfaces/bomberos.interfaces';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();
const router = useRouter();

const tableData = ref<BombTableItem[]>([]);
const rolesMap = reactive<Record<string, string>>({});
const selectedRowId = ref('');

const currentFilters = reactive({
  fullName: '',
  internalNumber: null as number | null,
  status: 1,
});

const statusList = genericOptionsList().statusList;

const tableHeads = [
  t('FormField.FullName'),
  t('FormField.Email'),
  t('FormField.InternalNum'),
  t('FormField.Status'),
  t('FormField.Role'),
];

onMounted(async () => {
  await getRolesBomb();
  await loadDataTable();
  desactivateSpinner();
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (currentFilters.fullName?.trim() !== '') count++;
  if (currentFilters.internalNumber !== null && currentFilters.internalNumber > 0) count++;
  if (currentFilters.status !== 1) count++;
  return count;
});

const loadDataTable = async () => {
  tableData.value = [];
  selectedRowId.value = '';

  const instBomb = await getInstitutionBomb(
    currentFilters.fullName,
    currentFilters.internalNumber,
    currentFilters.status === 1 ? null : currentFilters.status === 2,
  );

  if (instBomb.ok) {
    if (instBomb.data) {
      tableData.value = instBomb.data.map((bombero: InstBombDetail) => ({
        id: bombero.id,
        fullName: bombero.fullName,
        email: bombero.email,
        internalNumber: bombero.internalNum,
        isActive: bombero.isActive ? t('SelectOptions.Active') : t('SelectOptions.Inactive'),
        role: rolesMap[bombero.role as string] || t('SelectOptions.NoRole'),
      }));
    }
  } else {
    toast.error(instBomb.message ?? t('Messages.ErrorLoading'));
  }
};

const editBomb = async () => {
  if (selectedRowId.value) {
    await router.push(`/bomberos/${selectedRowId.value}/edit`);
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const changeStatusBomb = async () => {
  if (!selectedRowId.value) {
    toast.error(t('Validations.NoSelected'));
    return;
  }

  activeSpinner(t('Messages.Update'));

  const res = await changeStatus(selectedRowId.value.toString());

  if (res.ok) {
    toast.success(res.message);
    await loadDataTable();
  } else {
    toast.error(res.message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
};

const getRolesBomb = async () => {
  if (Object.keys(rolesMap).length > 0) return;

  const res = await getRolesList();

  if (res.ok && res.data) {
    res.data.forEach((role: { id: string; name: string }) => {
      rolesMap[role.id] = role.name;
    });
  } else {
    toast.error(res.message || t('Messages.ErrorLoading'));
  }
};

const addBomb = async () => {
  await router.push(`/bomberos/new`);
};

const filterClear = () => {
  currentFilters.fullName = '';
  currentFilters.internalNumber = null;
  currentFilters.status = 1;
  filterBombs();
};

const filterBombs = async () => {
  activeSpinner(t('Messages.Filter'));
  await loadDataTable();
  desactivateSpinner();
};
</script>
