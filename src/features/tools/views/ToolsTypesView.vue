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
          data-bs-target="#delToolTypeModal"
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
      ref="delToolTypeModalRef"
      :title-text="t('ToolsViews.TypesDeleteTitle')"
      modal-name="delToolTypeModal"
      @confirm="delToolType"
      @cancel="clearSelectedToolType"
    >
      <p class="m-0 text-secondary-themed fw-medium">{{ t('ToolsViews.TypesDeleteMessage') }}</p>
    </ModalBase>

    <ModalBase
      ref="toolTypeModalRef"
      :title-text="t('ToolsViews.ToolTypeModalTitle')"
      title-icon="bi-pencil-square"
      modal-name="toolTypeModal"
      form-name="toolTypeForm"
      btn-type="submit"
      :btn-text="isNewToolType ? t('Buttons.Save') : t('Buttons.Update')"
      @cancel="clearSelectedToolType"
    >
      <form @submit.prevent="saveChangeToolType" id="toolTypeForm">
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
      </form>
    </ModalBase>
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
import Table from '@/shared/components/Table.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import ModalBase from '@/shared/components/ModalBase.vue';
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
const { handleSubmit, resetForm } = useForm();

const tableHeads = [t('FormField.Name'), t('FormField.Detail'), t('ToolsViews.ToolCount')];
const tableData = ref<ToolTypeData[]>([]);
const activeToolType = ref<ToolTypeData | null>(null);
const isNewToolType = ref(false);
const selectedRowId = ref(0);
const delToolTypeModalRef = ref<InstanceType<typeof ModalBase> | null>(null);
const toolTypeModalRef = ref<InstanceType<typeof ModalBase> | null>(null);

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

  if (toolTypes.ok) {
    if (toolTypes.data) {
      tableData.value = toolTypes.data.map((type: ToolTypeData) => ({
        id: type.id,
        name: type.name,
        detail: type.detail == null || type.detail === '' ? '-' : type.detail,
        cantTools: type.cantTools,
      }));
    }
  } else {
    toast.error(toolTypes.message ?? t('Messages.ErrorLoading'));
  }
};

const clearSelectedToolType = () => {
  selectedRowId.value = 0;
  resetForm();
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
    toolTypeModalRef.value?.close();
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
      delToolTypeModalRef.value?.close();
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
