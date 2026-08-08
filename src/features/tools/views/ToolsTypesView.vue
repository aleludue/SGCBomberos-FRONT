<template>
  <div class="container">
    <SectionTitle
      :title="t('ToolsViews.TypesTitle')"
      :subtitle="t('ToolsViews.TypesSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('ToolsViews.MenuTitle'), link: '/tools' },
        { detail: t('ToolsViews.TypesTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2">
      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          data-bs-toggle="modal"
          data-bs-target="#toolTypeModal"
          @click="addToolType"
        />

        <BtnTable
          :activeBtn="activeToolType !== null"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          data-bs-toggle="modal"
          data-bs-target="#toolTypeModal"
          @click="editToolType"
        />

        <BtnTable
          :activeBtn="activeToolType !== null"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#validActionModal"
        />
      </div>

      <Table
        :tableHeads="tableHeads"
        :tableData="tableData"
        v-model:select-row-id="selectedRowId"
      />
    </div>

    <BtnBack :toHome="false" />

    <ModalValidAction
      :titleText="t('ToolsViews.TypesDeleteTitle')"
      :bodyText="t('ToolsViews.TypesDeleteMessage')"
      @confirm="delToolType"
    />

    <div
      class="modal fade"
      id="toolTypeModal"
      tabindex="-1"
      aria-hidden="true"
      aria-labelledby="toolTypeModalTitle"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div
          class="modal-content border border-secondary-subtle shadow-lg bg-body-tertiary custom-modal-tactical"
        >
          <div class="modal-header border-bottom border-secondary-subtle py-3 px-4">
            <h1
              id="toolTypeModalTitle"
              class="modal-title fs-5 fw-bold text-body d-flex align-items-center gap-2"
            >
              <i class="bi bi-calendar-event text-orange-fire"></i>
              {{ t('ToolsViews.ToolTypeModalTitle') }}
            </h1>
            <button
              type="button"
              class="btn-close btn-close-themed"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <form @submit.prevent="saveChangeToolType" id="toolTypeForm" class="row g-3">
            <div class="modal-body py-4 px-4 text-body">
              <div class="row g-3">
                <FieldText
                  :label-text="t('FormField.Name')"
                  field-name="modalToolTypeName"
                  :is-required="true"
                  :max-length="100"
                  :is-login-form="true"
                  v-model:text-det="modalRegDetail.name"
                />

                <FieldText
                  :label-text="t('FormField.Detail')"
                  field-name="modalToolTypeDetail"
                  :is-textarea="true"
                  v-model:text-det="modalRegDetail.detail"
                  :is-required="false"
                  :max-length="250"
                  :is-login-form="true"
                />
              </div>
            </div>
          </form>

          <div
            class="modal-footer border-top border-secondary-subtle py-3 px-4 d-flex justify-content-end gap-2"
          >
            <button
              id="closeModalNewEdit"
              type="button"
              class="btn btn-sm btn-outline-secondary px-3"
              data-bs-dismiss="modal"
            >
              {{ $t('Buttons.Close') }}
            </button>
            <BtnConfirm type="submit" form="toolTypeForm" class="px-4 fw-bold shadow-sm">
              <i class="bi bi-check-circle me-1"></i>
              {{ isNewToolType ? $t('Buttons.Save') : $t('Buttons.Update') }}
            </BtnConfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { onMounted, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';

import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import ModalValidAction from '@/shared/components/ModalValidAction.vue';
import Table from '@/shared/components/Table.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import type { ToolTypeData } from '@/features/tools/interfaces/tools.interfaces';
import {
  deleteToolType,
  getToolTypes,
  saveToolType,
  updateToolType,
} from '@/features/tools/services/toolType.action';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const toast = useToast();
const { handleSubmit } = useForm();

const tableHeads = [t('FormField.Name'), t('FormField.Detail'), t('ToolsViews.ToolCount')];
const tableData = ref<ToolTypeData[]>([]);
const activeToolType = ref<ToolTypeData | null>(null);
const isNewToolType = ref(false);
const selectedRowId = ref(0);

const modalRegDetail = ref<ToolTypeData>({
  id: 0,
  name: '',
  detail: '',
  cantTools: 0,
});

onMounted(async () => {
  await loadDataTable();
  desactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  activeToolType.value = null;

  const toolTypes = await getToolTypes();

  if (toolTypes.ok && toolTypes.data) {
    tableData.value = toolTypes.data.map((type: ToolTypeData) => ({
      id: type.id,
      name: type.name,
      detail: type.detail == null || type.detail === '' ? '-' : type.detail,
      cantTools: type.cantTools,
    }));
  } else {
    toast.error(toolTypes.message ?? t('Messages.ErrorLoading'));
  }
};

const addToolType = () => {
  isNewToolType.value = true;
  modalRegDetail.value = {
    id: 0,
    name: '',
    detail: '',
    cantTools: 0,
  };

  selectedRowId.value = 0;
};

const editToolType = () => {
  if (activeToolType.value) {
    isNewToolType.value = false;
    modalRegDetail.value.id = activeToolType.value.id;
    modalRegDetail.value.name = activeToolType.value.name;
    modalRegDetail.value.detail =
      activeToolType.value.detail === '-' ? '' : activeToolType.value.detail;
  }
};

const saveChangeToolType = handleSubmit(async () => {
  activeSpinner(t('Messages.Update'));

  const { ok, message } = isNewToolType.value
    ? await saveToolType(modalRegDetail.value.name, modalRegDetail.value.detail || '')
    : await updateToolType(
        modalRegDetail.value.id,
        modalRegDetail.value.name,
        modalRegDetail.value.detail || '',
      );

  if (ok) {
    toast.success(message);
    document.getElementById('closeModalNewEdit')?.click();
    await loadDataTable();
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});

const delToolType = async () => {
  if (activeToolType.value) {
    activeSpinner(t('Messages.Delete'));

    const result = await deleteToolType(activeToolType.value.id);

    if (result.ok) {
      toast.success(result.message);
      document.getElementById('closevalidActionModal')?.click();
      await loadDataTable();
    } else {
      toast.error(result.message || t('Messages.ErrorDelete'));
    }

    desactivateSpinner();
  }
};

watch(selectedRowId, (newId: number) => {
  activeToolType.value = tableData.value.find((tl) => tl.id === newId) || null;
});
</script>
