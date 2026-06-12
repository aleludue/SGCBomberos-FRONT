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

    <div class="d-flex flex-column gap-2">
      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="activeId !== 0"
          btnClass="btn-action-approve"
          icon="bi-check-circle"
          :text="$t('Buttons.Approve')"
          @applyAction="manageUser(true)"
        />

        <BtnTable
          :activeBtn="activeId !== 0"
          btnClass="btn-action-reject"
          icon="bi-x-circle"
          :text="$t('Buttons.Reject')"
          @applyAction="manageUser(false)"
        />
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
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { getPendingBomb, processRequest } from '@/features/bomberos/services/bomberos.action';
import type { PendingBombDetail } from '@/features/bomberos/interfaces/bomberos.interfaces';

const toast = useToast();
const { t } = useI18n();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();

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
    toast.error(pendBomb.message ?? t('Messages.ErrorLoading'));
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
    toast.success(res.message);
    await loadDataTable();
  } else {
    toast.error(res.message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
};
</script>
