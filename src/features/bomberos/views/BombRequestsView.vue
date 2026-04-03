<template>
  <title>{{ $t('BombGeneric.ViewTitle') }}</title>
  <div class="container">
    <SectionTitle
      :title="t('BombRequestsView.Title')"
      :subtitle="t('BombRequestsView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('BomberMenuView.Title'), link: '/bomberos' },
        { detail: $t('BombRequestsView.Title') },
      ]"
    />

    <div class="mt-3 mb-2">
      <button
        class="btn btn-outline-success me-2"
        :disabled="activeId === 0"
        @click="manageUser(true)"
      >
        {{ $t('GenericBtn.BtnApprove') }}
      </button>
      <button class="btn btn-outline-danger" :disabled="activeId === 0" @click="manageUser(false)">
        {{ $t('GenericBtn.BtnReject') }}
      </button>
    </div>

    <Table :tableHeads="tableHeads" :tableData="tableData" @selectRow="changeSelecTable" />

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import Table from '@/shared/components/Table.vue';
import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getPendingBomb, processRequest } from '@/features/bomberos/services/bomberos.action';

const configStore = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();

const tableHeads = [t('BombRequestsView.ColName'), t('BombRequestsView.ColEmail')];
const tableData = ref<any[]>([]);
const activeId = ref(0);

onMounted(async () => {
  configStore.activeSpinner(t('BombRequestsView.LoadBombSpinMsg'));
  await loadDataTable();
  configStore.deactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  activeId.value = 0;

  try {
    const { data } = await getPendingBomb();

    if (data) {
      tableData.value = data.map((bombero: any) => ({
        id: bombero.id,
        fullName: bombero.fullName,
        email: bombero.email,
      }));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }
};

const changeSelecTable = (tableId: number) => {
  if (tableId) {
    activeId.value = tableId;
  }
};

const manageUser = async (isApprove: boolean) => {
  if (activeId.value && activeId.value !== 0) {
    configStore.activeSpinner(t('BombRequestsView.SpinMsgAction'));

    try {
      var res = await processRequest(activeId.value, isApprove);

      if (res.ok) {
        toast.success(
          isApprove
            ? t('BombRequestsView.SuccessMsgApprove')
            : t('BombRequestsView.SuccessMsgReject'),
        );
        await loadDataTable();
      } else {
        toast.error(res.message || t('BombRequestsView.ErrorMsgAction'));
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
</script>
