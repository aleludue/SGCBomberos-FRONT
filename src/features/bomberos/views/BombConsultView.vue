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
      <BombFilter @applyFilter="filterData" />

      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="activeId !== 0"
          btnClass="btn-action-manage"
          icon="bi-pen"
          :text="$t('Buttons.Manage')"
          @applyAction="editBomb"
        />

        <BtnTable
          :activeBtn="activeId !== 0"
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
import { onMounted, ref, reactive, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import Table from '@/shared/components/Table.vue';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getRolesList } from '@/shared/services/generic.action';

import BombFilter from '@/features/bomberos/components/BombFilter.vue';
import { getInstitutionBomb, changeStatus } from '@/features/bomberos/services/bomberos.action';
import type { BombTableItem, InstBombDetail } from '../interfaces/bomberos.interfaces';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();
const router = useRouter();

const activeId = ref(0);
const actualInternalNum = ref(0);
const tableData = ref<BombTableItem[]>([]);
const rolesMap = reactive<Record<number, string>>({});
const selectedRowId = ref(0);

const currentFilters = reactive({
  fullName: null as string | null,
  internalNumber: null as number | null,
  isActive: null as boolean | null,
});

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

const loadDataTable = async () => {
  tableData.value = [];
  activeId.value = 0;

  const instBomb = await getInstitutionBomb(
    currentFilters.fullName,
    currentFilters.internalNumber,
    currentFilters.isActive,
  );

  if (instBomb.ok) {
    if (instBomb.data) {
      tableData.value = instBomb.data.map((bombero: InstBombDetail) => ({
        id: bombero.id,
        fullName: bombero.fullName,
        email: bombero.email,
        internalNumber: bombero.internalNum,
        isActive: bombero.isActive ? t('SelectOptions.Active') : t('SelectOptions.Inactive'),
        role: rolesMap[bombero.role as number] || t('SelectOptions.NoRole'),
      }));
    }
  } else {
    toast.error(instBomb.message ?? t('Messages.ErrorLoading'));
  }
};

const editBomb = async () => {
  if (activeId.value) {
    await router.push(`/bomberos/${activeId.value}/edit`);
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const changeStatusBomb = async () => {
  if (!activeId.value) {
    toast.error(t('Validations.NoSelected'));
    return;
  }

  activeSpinner(t('Messages.Update'));

  const res = await changeStatus(activeId.value.toString());

  if (res.ok) {
    toast.success(res.message);
    await loadDataTable();
  } else {
    toast.error(res.message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
};

const filterData = async (name: string | null, internal: number | null, status: boolean | null) => {
  currentFilters.fullName = name;
  currentFilters.internalNumber = internal;
  currentFilters.isActive = status;

  activeSpinner(t('Messages.Filter'));
  await loadDataTable();
  desactivateSpinner();
};

const getRolesBomb = async () => {
  if (Object.keys(rolesMap).length > 0) return;

  const res = await getRolesList();

  if (res.ok && res.data) {
    res.data.forEach((role: { id: number; name: string }) => {
      rolesMap[role.id] = role.name;
    });
  } else {
    toast.error(res.message || t('Messages.ErrorLoading'));
  }
};

watch(selectedRowId, (newId: number) => {
  activeId.value = newId;

  if (!newId) return;
  const selectedData = tableData.value.find((data) => data.id === newId);
  actualInternalNum.value = selectedData?.internalNumber || 0;
});
</script>
