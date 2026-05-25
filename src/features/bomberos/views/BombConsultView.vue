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

    <div class="d-flex flex-column gap-2 bg-transparent">
      <BombFilter @applyFilter="filterData" />

      <div class="my-1 d-flex gap-2">
        <button
          class="btn btn-sm btn-action-manage px-3 fw-bold"
          :disabled="activeId === 0"
          @click="editBomb"
        >
          <i class="bi bi-pen me-1"></i> {{ $t('Buttons.Manage') }}
        </button>
        <button
          class="btn btn-sm btn-action-status px-3 fw-bold"
          :disabled="activeId === 0"
          @click="changeStatusBomb"
        >
          <i class="bi bi-arrow-down-up me-1"></i> {{ $t('Buttons.ChangeStatus') }}
        </button>
      </div>

      <Table :tableHeads="tableHeads" :tableData="tableData" @selectRow="changeSelecTable" />
    </div>

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import Table from '@/shared/components/Table.vue';
import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BombFilter from '@/features/bomberos/components/BombFilter.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getInstitutionBomb, changeStatus } from '@/features/bomberos/services/bomberos.action';
import { getRolesList } from '@/shared/services/generic.action';

const { activeSpinner, deactivateSpinner } = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();
const router = useRouter();

const activeId = ref(0);
const actualInternalNum = ref(0);
const tableData = ref<any[]>([]);

const rolesMap = reactive<Record<number, string>>({});

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
});

const changeSelecTable = (tableId: number) => {
  activeId.value = tableId;

  if (!tableId) return;
  const selectedData = tableData.value.find((data) => data.id === tableId);
  actualInternalNum.value = selectedData?.internalNumber || 0;
};

const loadDataTable = async () => {
  tableData.value = [];
  activeId.value = 0;

  const instBomb = await getInstitutionBomb(
    currentFilters.fullName,
    currentFilters.internalNumber,
    currentFilters.isActive,
  );

  if (instBomb.ok && instBomb.data) {
    tableData.value = instBomb.data.map((bombero: any) => ({
      id: bombero.id,
      fullName: bombero.fullName,
      email: bombero.email,
      internalNumber: bombero.internalNum,
      isActive: bombero.isActive ? t('SelectOptions.Active') : t('SelectOptions.Inactive'),
      role: rolesMap[bombero.role] || t('SelectOptions.NoRole'),
    }));
  } else {
    toast.error(instBomb.message ?? t('Messages.Error'));
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
    toast.success(t('Messages.SuccessUpdate'));
    await loadDataTable();
  } else {
    toast.error(res.message || t('Messages.Error'));
  }

  deactivateSpinner();
};

const filterData = async (name: string | null, internal: number | null, status: boolean | null) => {
  currentFilters.fullName = name;
  currentFilters.internalNumber = internal;
  currentFilters.isActive = status;

  activeSpinner(t('Messages.Filter'));
  await loadDataTable();
  deactivateSpinner();
};

const getRolesBomb = async () => {
  if (Object.keys(rolesMap).length > 0) return;

  const res = await getRolesList();

  if (res.ok && res.data) {
    res.data.forEach((role: any) => {
      rolesMap[role.id] = role.name;
    });
  } else {
    toast.error(res.message || t('Messages.Error'));
  }
};
</script>
