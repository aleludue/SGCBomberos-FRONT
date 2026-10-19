<template>
  <div class="container">
    <SectionTitle
      :title="t('AssistanceViews.TypesTitle')"
      :subtitle="t('AssistanceViews.TypesSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('AssistanceViews.MenuTitle'), link: '/assistances' },
        { detail: t('AssistanceViews.TypesTitle') },
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
          data-bs-target="#typeModal"
          @click="addType"
        />

        <BtnTable
          :activeBtn="activeType !== null"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="t('Buttons.Edit')"
          data-bs-toggle="modal"
          data-bs-target="#typeModal"
          @click="editType"
        />

        <BtnTable
          :activeBtn="activeType !== null"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#delTypeModal"
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
      ref="delTypeModalRef"
      :title-text="t('AssistanceViews.TypesDeleteTitle')"
      modal-name="delTypeModal"
      @confirm="delType"
      @cancel="clearSelecType"
    >
      <p class="m-0 text-secondary-themed fw-medium">
        {{ t('AssistanceViews.TypesDeleteMessage') }}
      </p>
    </ModalBase>

    <ModalBase
      ref="typeModalRef"
      :title-text="t('AssistanceViews.TypeModalTitle')"
      title-icon="bi-pencil-square"
      modal-name="typeModal"
      form-name="typeForm"
      btn-type="submit"
      :btn-text="isNewType ? t('Buttons.Save') : t('Buttons.Update')"
      @cancel="clearSelecType"
    >
      <form @submit.prevent="saveChangeType" id="typeForm">
        <div class="row g-3">
          <FieldText
            :label-text="t('FormField.Name')"
            field-name="modalTypeName"
            :is-required="true"
            :max-length="100"
            :is-login-form="true"
            v-model:text-det="modalRegDetail.name"
          />

          <FieldText
            :label-text="t('FormField.Description')"
            field-name="modalTypeDetail"
            :is-textarea="true"
            v-model:text-det="modalRegDetail.description"
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
import { useForm } from 'vee-validate';
import { useToast } from 'vue-toastification';

import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import Table from '@/shared/components/Table.vue';
import ModalBase from '@/shared/components/ModalBase.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import type {
  AssistanceTypeData,
  AssistTypeSave,
} from '@/features/assistances/interfaces/assistances.interfaces';
import {
  deletAssistType,
  getAssistTypes,
  saveAssistType,
  updateAssistType,
} from '@/features/assistances/services/assistanceType.action';

const { t } = useI18n();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { handleSubmit, resetForm } = useForm();
const toast = useToast();

const tableHeads = [t('FormField.Name'), t('FormField.Description')];
const tableData = ref<AssistanceTypeData[]>([]);
const selectedRowId = ref('');
const activeType = ref<AssistanceTypeData | null>(null);
const isNewType = ref(false);
const delTypeModalRef = ref<InstanceType<typeof ModalBase> | null>(null);
const typeModalRef = ref<InstanceType<typeof ModalBase> | null>(null);

const modalRegDetail = ref<AssistanceTypeData>({
  id: '',
  name: '',
  description: '',
});

onMounted(async () => {
  await loadDataTable();
  desactivateSpinner();
});

const loadDataTable = async () => {
  tableData.value = [];
  activeType.value = null;

  const { ok, data, message } = await getAssistTypes();

  if (ok) {
    if (data) {
      tableData.value = data;
    }
  } else {
    toast.error(message ?? t('Messages.ErrorLoading'));
  }
};

const clearSelecType = () => {
  selectedRowId.value = '';
  resetForm();
};

const addType = () => {
  isNewType.value = true;
  modalRegDetail.value = {
    id: '',
    name: '',
    description: '',
  };

  selectedRowId.value = '';
  resetForm();
};

const editType = () => {
  if (activeType.value) {
    isNewType.value = false;
    modalRegDetail.value.id = activeType.value.id;
    modalRegDetail.value.name = activeType.value.name;
    modalRegDetail.value.description =
      activeType.value.description === '-' ? '' : activeType.value.description;

    resetForm();
  }
};

const delType = async () => {
  if (activeType.value) {
    activeSpinner(t('Messages.Delete'));

    const { ok, message } = await deletAssistType(activeType.value.id);

    if (ok) {
      toast.success(message);
      delTypeModalRef.value?.close();
      await loadDataTable();
    } else {
      toast.error(message || t('Messages.ErrorDelete'));
    }

    desactivateSpinner();
  }
};

const saveChangeType = handleSubmit(async () => {
  activeSpinner(t('Messages.Update'));

  const req: AssistTypeSave = {
    name: modalRegDetail.value.name,
    description: modalRegDetail.value.description,
  };

  const { ok, message } = isNewType.value
    ? await saveAssistType(req)
    : await updateAssistType(modalRegDetail.value.id, req);

  if (ok) {
    toast.success(message);
    typeModalRef.value?.close();
    await loadDataTable();
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});

watch(selectedRowId, (newId: string) => {
  activeType.value = tableData.value.find((tl) => tl.id === newId) || null;
});
</script>
