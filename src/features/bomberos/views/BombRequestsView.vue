<template>
  <div class="container">
    <SectionTitle
      :title="t('BomberosViews.RequestsTitle')"
      :subtitle="t('BomberosViews.RequestsSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('BomberosViews.MenuTitle'), link: '/bomberos' },
        { detail: $t('BomberosViews.RequestsTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2 bg-transparent">
      <div class="my-1 d-flex gap-2">
        <button
          class="btn btn-sm btn-action-approve px-4 fw-bold"
          :disabled="activeId === 0"
          @click="manageUser(true)"
        >
          <i class="bi bi-check-circle me-1"></i> {{ $t('Buttons.Approve') }}
        </button>
        <button
          class="btn btn-sm btn-action-reject px-4 fw-bold"
          :disabled="activeId === 0"
          @click="manageUser(false)"
        >
          <i class="bi bi-x-circle me-1"></i> {{ $t('Buttons.Reject') }}
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
import type { PendingBombDetail } from '@/features/bomberos/interfaces/bomberos.interfaces';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();

const tableHeads = [t('FormField.FullName'), t('FormField.Email')];
const tableData = ref<PendingBombDetail[]>([]);
const activeId = ref(0);

onMounted(async () => {
  await loadDataTable();
  desactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  activeId.value = 0;

  const pendBomb = await getPendingBomb();
  if (pendBomb.ok && pendBomb.data) {
    tableData.value = pendBomb.data.map((bombero: PendingBombDetail) => ({
      id: bombero.id,
      fullName: bombero.fullName,
      email: bombero.email,
    }));
  } else {
    toast.error(pendBomb.message ?? t('Messages.Error'));
  }
};

const changeSelecTable = (tableId: number) => {
  activeId.value = tableId;
};

const manageUser = async (isApprove: boolean) => {
  if (!activeId.value) {
    toast.error(t('Validations.NoSelected'));
    return;
  }

  activeSpinner(t('Messages.Update'));

  const res = await processRequest(activeId.value, isApprove);

  if (res.ok) {
    toast.success(t('Messages.SuccessUpdate'));
    await loadDataTable();
  } else {
    toast.error(res.message || t('Messages.Error'));
  }

  desactivateSpinner();
};
</script>

<style scoped>
.btn-action-approve {
  background-color: rgba(var(--brand-success-rgb), 0.1);
  color: var(--brand-success);
  border: 1px solid var(--brand-success);
  transition: all 0.2s ease;
}

.btn-action-approve:hover:not(:disabled) {
  background-color: var(--brand-success);
  color: var(--bs-on-brand-color);
  box-shadow: 0 4px 12px rgba(var(--brand-success-rgb), 0.25);
}

.btn-action-reject {
  background-color: rgba(var(--brand-danger-rgb), 0.1);
  color: var(--brand-danger);
  border: 1px solid var(--brand-danger);
  transition: all 0.2s ease;
}

.btn-action-reject:hover:not(:disabled) {
  background-color: var(--brand-danger);
  color: var(--bs-on-brand-color);
  box-shadow: 0 4px 12px rgba(var(--brand-danger-rgb), 0.25);
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
