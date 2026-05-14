<template>
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

    <div class="d-flex flex-column gap-2 bg-transparent">
      <div class="my-1 d-flex gap-2">
        <button
          class="btn btn-sm btn-action-approve px-4 fw-bold"
          :disabled="activeId === 0"
          @click="manageUser(true)"
        >
          <i class="bi bi-check-circle me-1"></i> {{ $t('GenericBtn.BtnApprove') }}
        </button>
        <button
          class="btn btn-sm btn-action-reject px-4 fw-bold"
          :disabled="activeId === 0"
          @click="manageUser(false)"
        >
          <i class="bi bi-x-circle me-1"></i> {{ $t('GenericBtn.BtnReject') }}
        </button>
      </div>

      <Table :tableHeads="tableHeads" :tableData="tableData" @selectRow="changeSelecTable" />
    </div>

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

const { activeSpinner, deactivateSpinner } = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();

const tableHeads = [t('BombRequestsView.ColName'), t('BombRequestsView.ColEmail')];
const tableData = ref<any[]>([]);
const activeId = ref(0);

onMounted(async () => {
  activeSpinner(t('BombRequestsView.LoadBombSpinMsg'));
  await loadDataTable();
  deactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  activeId.value = 0;

  const pendBomb = await getPendingBomb();
  if (pendBomb.ok && pendBomb.data) {
    tableData.value = pendBomb.data.map((bombero: any) => ({
      id: bombero.id,
      fullName: bombero.fullName,
      email: bombero.email,
    }));
  } else {
    toast.error(pendBomb.message ?? t('BombRequestsView.LoadErrorMsg'));
  }
};

const changeSelecTable = (tableId: number) => {
  activeId.value = tableId;
};

const manageUser = async (isApprove: boolean) => {
  if (!activeId.value) {
    toast.error(t('BomberListView.NoSelectedBomb'));
    return;
  }

  activeSpinner(t('BombRequestsView.SpinMsgAction'));

  const res = await processRequest(activeId.value, isApprove);

  if (res.ok) {
    toast.success(
      isApprove ? t('BombRequestsView.SuccessMsgApprove') : t('BombRequestsView.SuccessMsgReject'),
    );
    await loadDataTable();
  } else {
    toast.error(res.message || t('BombRequestsView.ErrorMsgAction'));
  }

  deactivateSpinner();
};
</script>

<style scoped>
.btn-action-approve {
  background-color: rgba(25, 135, 84, 0.1);
  color: #198754;
  border: 1px solid #198754;
  transition: all 0.2s ease;
}

.btn-action-approve:hover:not(:disabled) {
  background-color: #198754;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(25, 135, 84, 0.25);
}

.btn-action-reject {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid #dc3545;
  transition: all 0.2s ease;
}

.btn-action-reject:hover:not(:disabled) {
  background-color: #dc3545;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.25);
}

.btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: var(--bs-border-color) !important;
  color: var(--bs-secondary-color) !important;
  background-color: transparent !important;
  box-shadow: none !important;
}
</style>
