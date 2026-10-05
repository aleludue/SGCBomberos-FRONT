<template>
  <div class="tab-pane fade" id="bomb-history-tab" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column">
      <div class="d-flex flex-row justify-content-between align-items-center">
        <FormTitle :titleText="$t('FormSections.ServiceHistory')" />

        <div
          class="ms-sm-auto custom-status-badge text-rigth mb-2"
          :class="bombInService ? 'custom-status-badge-active' : 'custom-status-badge-inactive'"
        >
          <span class="custom-status-badge-dot"></span>
          <span class="status-text text-center">
            {{ bombInService ? $t('SelectOptions.InService') : $t('SelectOptions.OutService') }}
          </span>
        </div>
      </div>

      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          data-bs-toggle="modal"
          data-bs-target="#historyModal"
          @click="addHistory"
        />

        <BtnTable
          :activeBtn="activeHistoryDet !== null"
          btnClass="btn-action-edit"
          icon="bi-pencil-square"
          :text="$t('Buttons.Edit')"
          data-bs-toggle="modal"
          data-bs-target="#historyModal"
          @click="editHistory"
        />

        <BtnTable
          :activeBtn="activeHistoryDet !== null"
          btnClass="btn-action-delete"
          icon="bi-file-earmark-minus"
          :text="$t('Buttons.Delete')"
          data-bs-toggle="modal"
          data-bs-target="#deleteHistoryModal"
        />
      </div>

      <Table
        :tableHeads="tableHeads"
        :tableData="histoyData"
        v-model:select-row-id="selectedRowId"
      />
    </div>
  </div>

  <ModalBase
    ref="deleteHistoryModalRef"
    :title-text="t('BomberosViews.ServiceHistoryDeleteTitle')"
    modal-name="deleteHistoryModal"
    @confirm="deleteHistory"
    @cancel="clearSelHistory"
  >
    <p class="m-0 text-secondary-themed fw-medium">
      {{ t('BomberosViews.ServiceHistoryDeleteMessage') }}
    </p>
  </ModalBase>

  <ModalBase
    ref="historyModalRef"
    :title-text="t('BomberosViews.ServiceHistoryModalTitle')"
    title-icon="bi-pencil-square"
    modal-name="historyModal"
    form-name="editHistoryForm"
    btn-type="submit"
    :btn-text="isNewHistory ? $t('Buttons.Save') : $t('Buttons.Update')"
    @cancel="clearSelHistory"
  >
    <form @submit.prevent="saveChangeHistory" id="editHistoryForm" class="row g-3">
      <div class="col-6">
        <FieldDate
          :label-text="$t('BomberosViews.ServiceHistoryStart')"
          v-model:date-val="modalRegDetail.dateStart"
          :is-required="true"
          :max-date="new Date()"
          :is-login-form="true"
          field-name="modalStartDate"
        />
      </div>

      <div class="col-6">
        <FieldDate
          :label-text="$t('BomberosViews.ServiceHistoryEnd')"
          v-model:date-val="modalRegDetail.dateDown"
          :is-required="false"
          :min-date="modalRegDetail.dateStart"
          :max-date="new Date()"
          :is-login-form="true"
          field-name="modalEndDate"
        />
      </div>

      <FieldText
        :label-text="t('BomberosViews.ServiceHistoryMotive')"
        field-name="modaldownReason"
        :max-length="255"
        :is-login-form="true"
        v-model:text-det="modalRegDetail.downReason"
      />
    </form>
  </ModalBase>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { localDateToIso } from '@/shared/utils/genericFuntions';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import Table from '@/shared/components/Table.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import ModalBase from '@/shared/components/ModalBase.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';

import type {
  BombHistoryDetail,
  SaveBombHistory,
} from '@/features/serviceHistory/interfaces/servicehistory.interfaces';
import {
  deleteServiceHistory,
  editServiceHistory,
  getServiceHistory,
  saveServiceHistory,
} from '@/features/serviceHistory/services/serviceHistory.action';

const toast = useToast();
const route = useRoute();
const { t } = useI18n();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { handleSubmit } = useForm();

const tableHeads = [
  t('BomberosViews.ServiceHistoryStart'),
  t('BomberosViews.ServiceHistoryEnd'),
  t('BomberosViews.ServiceHistoryMotive'),
];

const isNewHistory = ref(false);
const selectedRowId = ref('');
const bombInService = ref(false);
const histoyData = ref<BombHistoryDetail[]>([]);
const activeHistoryDet = ref<BombHistoryDetail | null>(null);
const modalRegDetail = ref<BombHistoryDetail>({
  id: '',
  dateStart: '',
  dateDown: undefined,
  downReason: '',
});

const deleteHistoryModalRef = ref<InstanceType<typeof ModalBase> | null>(null);
const historyModalRef = ref<InstanceType<typeof ModalBase> | null>(null);

onMounted(async () => {
  await getHistoryDetail();
  desactivateSpinner();
});

const getHistoryDetail = async () => {
  histoyData.value = [];
  activeHistoryDet.value = null;
  bombInService.value = false;

  const { ok, data, message } = await getServiceHistory(route.params.id as string);

  if (ok && data?.serviceHistory) {
    bombInService.value = data.inService;

    histoyData.value = data.serviceHistory.map((entry) => ({
      id: entry.id,
      dateStart: entry.dateStart || '',
      dateDown: entry.dateDown || undefined,
      downReason: entry.downReason,
    }));
  } else {
    toast.error(message || t('Messages.ErrorLoading'));
  }
};

const clearSelHistory = () => {
  selectedRowId.value = '';
};

const addHistory = () => {
  isNewHistory.value = true;
  modalRegDetail.value = {
    id: '',
    dateStart: '',
    dateDown: undefined,
    downReason: '',
  };
  selectedRowId.value = '';
};

const editHistory = () => {
  if (activeHistoryDet.value) {
    isNewHistory.value = false;

    modalRegDetail.value.id = activeHistoryDet.value.id;
    modalRegDetail.value.downReason = activeHistoryDet.value.downReason || '';
    modalRegDetail.value.dateStart = localDateToIso(activeHistoryDet.value.dateStart || '');
    modalRegDetail.value.dateDown = activeHistoryDet.value.dateDown
      ? localDateToIso(activeHistoryDet.value.dateDown)
      : undefined;
  }
};

const deleteHistory = async () => {
  if (activeHistoryDet.value) {
    activeSpinner(t('Messages.Delete'));

    const result = await deleteServiceHistory(
      activeHistoryDet.value?.id,
      route.params.id as string,
    );

    if (result.ok) {
      toast.success(result.message);
      deleteHistoryModalRef.value?.close();
      await getHistoryDetail();
    } else {
      toast.error(result.message || t('Messages.ErrorDelete'));
    }

    desactivateSpinner();
  }
};

const saveChangeHistory = handleSubmit(async () => {
  activeSpinner(t('Messages.Update'));

  const req: SaveBombHistory = {
    bombId: route.params.id as string,
    serviceStart: modalRegDetail.value?.dateStart,
    serviceFinish: modalRegDetail.value?.dateDown,
    finishDesc: modalRegDetail.value?.downReason,
  };

  const { ok, message } = isNewHistory.value
    ? await saveServiceHistory(req)
    : await editServiceHistory(modalRegDetail.value?.id, req);

  if (ok) {
    toast.success(message);
    historyModalRef.value?.close();
    await getHistoryDetail();
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});

watch(selectedRowId, (newId: string) => {
  activeHistoryDet.value = histoyData.value.find((entry) => entry.id === newId) || null;
});
</script>
