<template>
  <div class="container">
    <SectionTitle
      :title="$t('InterventionViews.ManageTitle')"
      :subtitle="$t('InterventionViews.ManageSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('InterventionViews.MenuTitle'), link: '/interventions' },
        { detail: $t('InterventionViews.ManageTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2">
      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="selectedRowId !== ''"
          btnClass="btn-action-approve"
          icon="bi-check-circle"
          :text="$t('Buttons.Approve')"
          @applyAction="manageUser(true)"
        />

        <BtnTable
          :activeBtn="selectedRowId !== ''"
          btnClass="btn-action-reject"
          icon="bi-x-circle"
          :text="$t('Buttons.Reject')"
          @applyAction="manageUser(false)"
        />

        <BtnTable
          :activeBtn="selectedRowId !== ''"
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import Table from '@/shared/components/Table.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import type { IntervData } from '@/features/interventions/interfaces/interventions.interfaces';
import {
  getInterventions,
  updateIntervStatus,
} from '@/features/interventions/services/interventions.action';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const tableHeads = [
  t('FormField.ActNumber'),
  t('FormField.Status'),
  t('FormField.TypeSinister'),
  t('FormField.Creator'),
  t('FormField.CommandChief'),
];
const tableData = ref<IntervData[]>([]);
const selectedRowId = ref('');

onMounted(async () => {
  await loadDataTable();
  desactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  selectedRowId.value = '';

  const { ok, data, message } = await getInterventions(true);

  if (ok && data) {
    tableData.value = data;
  } else {
    toast.error(message ?? t('Messages.ErrorLoading'));
  }
};

const showInterv = async () => {
  if (selectedRowId.value !== '') {
    await router.push(`/interventions/${selectedRowId.value}/detail`);
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const manageUser = async (isApprove: boolean) => {
  if (!selectedRowId.value) {
    toast.error(t('Validations.NoSelected'));
    return;
  }

  activeSpinner(t('Messages.Update'));

  const { ok, message } = await updateIntervStatus(selectedRowId.value, isApprove);

  if (!ok) {
    toast.error(message || t('Messages.ErrorUpdate'));
    return;
  }

  toast.success(message);
  await loadDataTable();

  desactivateSpinner();
};
</script>
