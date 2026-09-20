<template>
  <div class="container">
    <SectionTitle
      :title="$t('InterventionViews.ConsultTitle')"
      :subtitle="$t('InterventionViews.ConsultSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('InterventionViews.MenuTitle'), link: '/interventions' },
        { detail: $t('InterventionViews.ConsultTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2">
      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          @click="addInterv"
        />

        <BtnTable
          :activeBtn="
            selectedRowId !== '' &&
            tableData.find((x) => x.id == selectedRowId)?.status != 'Borrador'
          "
          btnClass="btn-action-info"
          icon="bi-eye"
          :text="t('Buttons.Show')"
          @click="showInterv"
        />

        <BtnTable
          :activeBtn="
            selectedRowId !== '' &&
            tableData.find((x) => x.id == selectedRowId)?.status == 'Borrador'
          "
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          @click="editInterv"
        />

        <BtnTable
          :activeBtn="
            selectedRowId !== '' &&
            tableData.find((x) => x.id == selectedRowId)?.status == 'Borrador'
          "
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#intervDeleteModal"
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
      ref="intervDeleteModalRef"
      :title-text="t('InterventionViews.IntervDeleteTitle')"
      modal-name="intervDeleteModal"
      @confirm="delInterv"
      @cancel="clearSelect"
    >
      <p class="m-0 text-secondary-themed fw-medium">
        {{ t('InterventionViews.IntervDeleteMessage') }}
      </p>
    </ModalBase>
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
import ModalBase from '@/shared/components/ModalBase.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import type { IntervData } from '@/features/interventions/interfaces/interventions.interfaces';
import {
  deleteIntervention,
  getInterventions,
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
const intervDeleteModalRef = ref<InstanceType<typeof ModalBase> | null>(null);

onMounted(async () => {
  await loadDataTable();
  desactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  selectedRowId.value = '';

  const { ok, data, message } = await getInterventions(null, false);

  if (ok && data) {
    tableData.value = data;
  } else {
    toast.error(message ?? t('Messages.ErrorLoading'));
  }
};

const addInterv = async () => {
  await router.push(`/interventions/new`);
};

const editInterv = async () => {
  if (selectedRowId.value !== '') {
    await router.push(`/interventions/${selectedRowId.value}/edit`);
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const showInterv = async () => {
  if (selectedRowId.value !== '') {
    await router.push(`/interventions/${selectedRowId.value}/detail`);
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const delInterv = async () => {
  if (selectedRowId.value) {
    activeSpinner(t('Messages.Delete'));

    const result = await deleteIntervention(selectedRowId.value);

    if (result.ok) {
      toast.success(result.message);
      intervDeleteModalRef.value?.close();
      await loadDataTable();
    } else {
      toast.error(result.message || t('Messages.ErrorDelete'));
    }

    desactivateSpinner();
  }
};

const clearSelect = () => {
  selectedRowId.value = '';
};
</script>
