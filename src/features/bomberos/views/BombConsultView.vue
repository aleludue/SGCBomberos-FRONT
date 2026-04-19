<template>
  <title>{{ $t('BombGeneric.ViewTitle') }}</title>
  <div class="container">
    <SectionTitle
      :title="t('BomberListView.Title')"
      :subtitle="t('BomberListView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('BomberMenuView.Title'), link: '/bomberos' },
        { detail: $t('BomberListView.Title') },
      ]"
    />

    <BombFilter @applyFilter="filterData"></BombFilter>

    <div class="mt-3 mb-2 d-flex gap-2">
      <button class="btn btn-outline-info" :disabled="activeId === 0" @click="editBomb">
        <i class="bi bi-pen"></i>
        {{ $t('BomberListView.BtnManage') }}
      </button>

      <button class="btn btn-outline-warning" :disabled="activeId === 0" @click="changeStatusBomb">
        <i class="bi bi-arrow-down-up"></i>
        {{ $t('BomberListView.BtnStatus') }}
      </button>
    </div>

    <Table :tableHeads="tableHeads" :tableData="tableData" @selectRow="changeSelecTable" />

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

import Table from '@/shared/components/Table.vue';
import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getInstitutionBomb, changeStatus } from '@/features/bomberos/services/bomberos.action';
import { getRolesList } from '@/shared/services/generic.action';
import BombFilter from '@/features/bomberos/components/BombFilter.vue';
import router from '@/router';

const configStore = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();

const activeId = ref(0);
const actualInternalNum = ref(0);
const roleList = ref<{ id: number; name: string }[]>([]);

const tableHeads = [
  t('BomberListView.ColName'),
  t('BomberListView.ColEmail'),
  t('BomberListView.ColIntNum'),
  t('BomberListView.ColStatus'),
  t('BomberListView.ColRole'),
];
const tableData = ref<any[]>([]);

onMounted(async () => {
  configStore.activeSpinner(t('BomberListView.LoadBombSpinMsg'));
  await getRolesBomb();
  await loadDataTable(null, null, null);
  configStore.deactivateSpinner();
});

const changeSelecTable = (tableId: number) => {
  if (tableId) {
    const selectedData = tableData.value.find((data) => data.id === tableId);
    activeId.value = tableId;
    actualInternalNum.value = selectedData?.internalNumber || 0;
  }
};

const loadDataTable = async (
  fullName: string | null,
  internalNumber: number | null,
  isActive: boolean | null,
) => {
  tableData.value = [];
  activeId.value = 0;

  try {
    const { data } = await getInstitutionBomb(fullName, internalNumber, isActive);

    if (data) {
      tableData.value = data.map((bombero: any) => ({
        id: bombero.id,
        fullName: bombero.fullName,
        email: bombero.email,
        internalNumber: bombero.internalNum,
        isActive: bombero.isActive
          ? t('BomberListView.StatusActive')
          : t('BomberListView.StatusInactive'),
        role:
          roleList.value.find((role) => role.id === bombero.role)?.name ||
          t('BomberListView.NoRole'),
      }));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }
};

const editBomb = () => {
  if (activeId.value && activeId.value !== 0) {
    router.push(`/bomberos/${activeId.value}/edit`);
  } else {
    toast.error(t('BomberListView.NoSelectedBomb'));
  }
};

const changeStatusBomb = async () => {
  if (activeId.value && activeId.value !== 0) {
    configStore.activeSpinner(t('BomberListView.SpinMsgStatus'));

    try {
      var res = await changeStatus(activeId.value.toString());

      if (res.ok) {
        toast.success(t('BomberListView.SuccessMsgStatus'));
        await loadDataTable(null, null, null);
      } else {
        toast.error(res.message || t('BomberListView.ErrorMsgStatus'));
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      configStore.deactivateSpinner();
    }
  } else {
    toast.error(t('BomberListView.NoSelectedBomb'));
  }
};

const filterData = async (name: string | null, internal: number | null, status: boolean | null) => {
  configStore.activeSpinner(t('BomberListView.SpinMsgFilter'));
  await loadDataTable(name, internal, status);
  configStore.deactivateSpinner();
};

const getRolesBomb = async () => {
  if (roleList.value.length === 0) {
    configStore.activeSpinner(t('BomberListView.SpinMsgRoles'));

    try {
      const res = await getRolesList();

      if (res.ok && res.data) {
        roleList.value = res.data.map((role: any) => ({
          id: role.id,
          name: role.name,
        }));
      } else {
        toast.error(res.message || t('BomberListView.ErrorMsgRoles'));
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      configStore.deactivateSpinner();
    }
  }
};
</script>
