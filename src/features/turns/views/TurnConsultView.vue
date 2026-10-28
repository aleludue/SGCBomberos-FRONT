<template>
  <div class="container">
    <SectionTitle
      :title="$t('TurnsViews.ConsultTitle')"
      :subtitle="$t('TurnsViews.ConsultSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('TurnsViews.MenuTitle'), link: '/turns' },
        { detail: $t('TurnsViews.ConsultTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2">
      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          @click="addTurn"
        />

        <BtnTable
          :activeBtn="selectedRowId !== ''"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          @applyAction="editTurn"
        />

        <BtnTable
          :activeBtn="selectedRowId !== ''"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#turnDeleteModal"
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
      ref="turnDeleteModalRef"
      :title-text="t('TurnsViews.DeleteTitle')"
      modal-name="turnDeleteModal"
      @confirm="delTurn"
      @cancel="clearSelect"
    >
      <p class="m-0 text-secondary-themed fw-medium">
        {{ t('TurnsViews.DeleteMessage') }}
      </p>
    </ModalBase>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

import Table from '@/shared/components/Table.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import ModalBase from '@/shared/components/ModalBase.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import type { TurnsData } from '@/features/turns/interfaces/turns.interfaces';
import { deleteTurn, getTurns } from '@/features/turns/services/turns.action';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const tableData = ref<TurnsData[]>([]);
const selectedRowId = ref('');
const turnDeleteModalRef = ref<InstanceType<typeof ModalBase> | null>(null);

const tableHeads = [t('FormField.Name'), t('FormField.Order'), t('FormField.BombCount')];

onMounted(async () => {
  await loadDataTable();
  desactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  selectedRowId.value = '';

  const { ok, data, message } = await getTurns();

  if (ok) {
    if (data) {
      tableData.value = data;
    }
  } else {
    toast.error(message ?? t('Messages.ErrorLoading'));
  }
};

const addTurn = async () => {
  await router.push(`/turns/new`);
};

const editTurn = async () => {
  if (selectedRowId.value) {
    await router.push(`/turns/${selectedRowId.value}/edit`);
  } else {
    toast.error(t('Validations.NoSelected'));
  }
};

const delTurn = async () => {
  if (selectedRowId.value) {
    activeSpinner(t('Messages.Delete'));

    const { ok, message } = await deleteTurn(selectedRowId.value);

    if (ok) {
      toast.success(message);
      turnDeleteModalRef.value?.close();
      await loadDataTable();
    } else {
      toast.error(message || t('Messages.ErrorDelete'));
    }

    desactivateSpinner();
  }
};

const clearSelect = () => {
  selectedRowId.value = '';
};
</script>
