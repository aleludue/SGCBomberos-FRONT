<template>
  <div class="container edit-bomber-container">
    <SectionTitle
      :title="$t('BomberosViews.EditTitle')"
      :subtitle="$t('BomberosViews.EditSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('BomberosViews.MenuTitle'), link: '/bomberos' },
        { detail: $t('BomberosViews.ConsultTitle'), link: '/bomberos/consult' },
        { detail: $t('BomberosViews.EditTitle') },
      ]"
    />

    <div class="d-flex flex-column">
      <FormTitle :titleText="$t('FormSections.PersonalData')" />
      <div class="row mb-3">
        <FieldReadOnly :label-text="$t('FormField.FullName')" :valueText="bombDetails.fullName" />
        <FieldReadOnly :label-text="$t('FormField.Email')" :valueText="bombDetails.email" />
        <FieldReadOnly :label-text="$t('FormField.Document')" :valueText="bombDetails.document" />
        <FieldReadOnly :label-text="$t('FormField.BirthDate')" :valueText="bombDetails.dateBirth" />
        <FieldReadOnly :label-text="$t('FormField.Direction')" :valueText="bombDetails.direction" />
        <FieldReadOnly :label-text="$t('FormField.City')" :valueText="bombDetails.locality" />
        <FieldSelector
          :label-text="$t('FormField.Gender')"
          v-model:option="bombDetails.gender"
          :readonly="true"
          :options-list="genderOptions"
        />
        <FieldReadOnly
          :label-text="$t('FormField.HomePhone')"
          :valueText="bombDetails.homePhone?.toString()"
        />
        <FieldReadOnly
          :label-text="$t('FormField.CellPhone')"
          :valueText="bombDetails.cellPhone?.toString()"
        />
      </div>

      <FormTitle :titleText="$t('FormSections.InstitConfig')" />

      <div
        class="alert border border-secondary-subtle bg-body text-body-secondary small d-flex align-items-center gap-2 py-2 px-3 mb-2 rounded-2 shadow-sm"
      >
        <i class="bi bi-info-circle text-orange-fire fs-5"></i>
        <span>{{ $t('Messages.UpdateAutomatic') }}</span>
      </div>

      <div class="row mb-2">
        <FieldTimeAction
          :labelText="$t('FormField.InternalNum')"
          v-model="bombDetails.internalNum"
          @apply-search="changeInternalNum"
        />
        <FieldSelector
          :label-text="$t('FormField.Role')"
          v-model:option="bombDetails.role"
          :readonly="false"
          :options-list="roleList"
          :base-option-text="$t('SelectOptions.NoRole')"
          field-name="rolSelect"
        />

        <FieldSwitch :labelText="$t('FormField.Status')" v-model="bombDetails.isActive" />
        <FieldSwitch
          :labelText="$t('FormField.Driver')"
          v-model="bombDetails.isDriver"
          :textActive="$t('SelectOptions.Yes')"
          :textInactive="$t('SelectOptions.No')"
        />
      </div>

      <div class="d-flex flex-column gap-2">
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
            data-bs-target="#validActionModal"
          />
        </div>

        <Table :tableHeads="tableHeads" :tableData="histoyData" @selectRow="changeSelecTable" />
      </div>
    </div>

    <BtnBack :toHome="false" />

    <ModalValidAction
      :titleText="$t('BomberosViews.ServiceHistoryDeleteTitle')"
      :bodyText="$t('BomberosViews.ServiceHistoryDeleteMessage')"
      @confirm="deleteHistory"
    />

    <div
      class="modal fade"
      id="historyModal"
      tabindex="-1"
      aria-hidden="true"
      aria-labelledby="historyModalTitle"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div
          class="modal-content border border-secondary-subtle shadow-lg bg-body-tertiary custom-modal-tactical"
        >
          <div class="modal-header border-bottom border-secondary-subtle py-3 px-4">
            <h1
              id="historyModalTitle"
              class="modal-title fs-5 fw-bold text-body d-flex align-items-center gap-2"
            >
              <i class="bi bi-calendar-event text-orange-fire"></i>
              {{ $t('BomberosViews.ServiceHistoryModalTitle') }}
            </h1>
            <button
              type="button"
              class="btn-close btn-close-themed"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body py-4 px-4 text-body">
            <form class="row g-3">
              <div class="col-12">
                <label for="modalStartDate" class="form-label small fw-bold text-secondary">
                  {{ $t('BomberosViews.ServiceHistoryStart') }}
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="modalStartDate"
                  v-model="modalRegDetail.dateStart"
                />
              </div>
              <div class="col-12">
                <label for="modalEndDate" class="form-label small fw-bold text-secondary">
                  {{ $t('BomberosViews.ServiceHistoryEnd') }}
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="modalEndDate"
                  v-model="modalRegDetail.dateDown"
                />
              </div>
              <div class="col-12">
                <label for="modaldownReason" class="form-label small fw-bold text-secondary">
                  {{ $t('BomberosViews.ServiceHistoryMotive') }}
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="modaldownReason"
                  v-model="modalRegDetail.downReason"
                />
              </div>
            </form>
          </div>

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
            <BtnConfirm type="button" class="px-4 fw-bold shadow-sm" @click="saveChangeHistory">
              <i class="bi bi-check-circle me-1"></i>
              {{ isNewHistory ? $t('Buttons.Save') : $t('Buttons.Update') }}
            </BtnConfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { getRolesList } from '@/shared/services/generic.action';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { isoToLocalDate, localDateToIso } from '@/shared/utils/genericFuntions';
import { genericOptionsList } from '@/shared/composables/genericOptionList';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import Table from '@/shared/components/Table.vue';
import ModalValidAction from '@/shared/components/ModalValidAction.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import FieldTimeAction from '@/shared/components/Inputs/FieldTimeAction.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import FieldSwitch from '@/shared/components/Inputs/FieldSwitch.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';

import {
  changeDriverStatus,
  changeIntNum,
  changeRole,
  changeStatus,
  getBombDetail,
} from '@/features/bomberos/services/bomberos.action';
import {
  deleteServiceHistory,
  editServiceHistory,
  getServiceHistory,
  saveServiceHistory,
} from '@/features/serviceHistory/services/serviceHistory.action';
import type { BombHistoryDetail } from '@/features/serviceHistory/interfaces/servicehistory.interfaces';

const toast = useToast();
const route = useRoute();
const { t } = useI18n();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();

const roleList = ref<{ id: number; name: string }[]>([]);
const bombDetails = ref({
  fullName: undefined as string | undefined,
  email: undefined as string | undefined,
  internalNum: undefined as string | undefined,
  isDriver: false as boolean,
  isActive: false as boolean,
  role: undefined as number | undefined,
  gender: undefined as number | undefined,
  document: undefined as string | undefined,
  dateBirth: undefined as string | undefined,
  direction: undefined as string | undefined,
  locality: undefined as string | undefined,
  cellPhone: undefined as string | undefined,
  homePhone: undefined as string | undefined,
});

const tableHeads = [
  t('BomberosViews.ServiceHistoryStart'),
  t('BomberosViews.ServiceHistoryEnd'),
  t('BomberosViews.ServiceHistoryMotive'),
];

const histoyData = ref<BombHistoryDetail[]>([]);
const activeHistoryDet = ref<BombHistoryDetail | null>(null);
const modalRegDetail = ref<BombHistoryDetail>({
  id: 0,
  dateStart: '',
  dateDown: '',
  downReason: '',
});
const isNewHistory = ref(false);
const loading = ref(true);
const genderOptions = genericOptionsList().genderList;
const bombInService = ref(false);

onMounted(async () => {
  const resRol = await getRolesList();

  if (resRol.ok && resRol.data) {
    roleList.value = resRol.data.map((role: { id: number; name: string }) => ({
      id: role.id,
      name: role.name,
    }));
  } else {
    toast.error(resRol.message || t('Messages.ErrorLoading'));
    return;
  }

  await loadBombData();
  await getHistoryDetail();

  loading.value = false;

  desactivateSpinner();
});

const loadBombData = async () => {
  bombDetails.value = {
    fullName: undefined,
    email: undefined,
    internalNum: undefined,
    isDriver: false,
    isActive: false,
    role: undefined,
    gender: undefined,
    document: undefined,
    dateBirth: undefined,
    direction: undefined,
    locality: undefined,
    cellPhone: undefined,
    homePhone: undefined,
  };

  const resBomb = await getBombDetail(route.params.id as string);

  if (resBomb.ok && resBomb.data) {
    bombDetails.value = {
      fullName: resBomb.data.user.fullName,
      email: resBomb.data.user.email,
      gender: resBomb.data.user.gender || undefined,
      internalNum: resBomb.data.user.internalNum.toString(),
      isDriver: resBomb.data.user.isDriver,
      isActive: resBomb.data.user.isActive,
      role: resBomb.data.user.role ?? 0,
      document:
        resBomb.data.user.docType && resBomb.data.user.docNum
          ? resBomb.data.user.docType + ' - ' + resBomb.data.user.docNum
          : undefined,
      dateBirth: resBomb.data.user.dateBirth
        ? isoToLocalDate(resBomb.data.user.dateBirth)
        : undefined,
      direction: undefined,
      locality:
        resBomb.data.user.locality && resBomb.data.user.province
          ? resBomb.data.user.locality + ' (' + resBomb.data.user.province + ')'
          : undefined,
      cellPhone: resBomb.data.user.cellPhone,
      homePhone: resBomb.data.user.homePhone,
    };

    if (resBomb.data.user.direction && resBomb.data.user.dirNumber) {
      bombDetails.value.direction =
        resBomb.data.user.direction + ' ' + resBomb.data.user.dirNumber?.toString();

      if (resBomb.data.user.dirFloor) {
        bombDetails.value.direction +=
          ' - ' + t('FormField.StreetFloor') + ' ' + resBomb.data.user.dirFloor?.toString();
      }

      if (resBomb.data.user.dirDpto) {
        bombDetails.value.direction +=
          ' - ' + t('FormField.StreetDept') + ' ' + resBomb.data.user.dirDpto?.toString();
      }
    }
  } else {
    toast.error(resBomb.message || t('Messages.ErrorLoading'));
  }
};

const changeSelecTable = (tableId: number) => {
  if (tableId) {
    activeHistoryDet.value = histoyData.value.find((entry) => entry.id === tableId) || null;
  }
};

const addHistory = () => {
  isNewHistory.value = true;
  modalRegDetail.value = {
    id: 0,
    dateStart: '',
    dateDown: '',
    downReason: '',
  };
};

const editHistory = () => {
  if (activeHistoryDet.value) {
    isNewHistory.value = false;

    modalRegDetail.value.downReason = activeHistoryDet.value.downReason || '';
    modalRegDetail.value.id = activeHistoryDet.value.id;

    modalRegDetail.value.dateStart = localDateToIso(activeHistoryDet.value.dateStart || '');
    modalRegDetail.value.dateDown = localDateToIso(activeHistoryDet.value.dateDown || '');
  }
};

const deleteHistory = async () => {
  if (activeHistoryDet.value) {
    activeSpinner(t('Messages.Delete'));

    loading.value = true;

    const result = await deleteServiceHistory(activeHistoryDet.value?.id);

    if (result.ok) {
      toast.success(result.message);
      document.getElementById('closevalidActionModal')?.click();
      await getHistoryDetail();
    } else {
      toast.error(result.message || t('Messages.ErrorDelete'));
    }

    loading.value = false;
    desactivateSpinner();
  }
};

const saveChangeHistory = async () => {
  loading.value = true;

  activeSpinner(t('Messages.Update'));

  if (isNewHistory.value) {
    const result = await saveServiceHistory(
      route.params.id as string,
      modalRegDetail.value?.dateStart,
      modalRegDetail.value?.dateDown,
      modalRegDetail.value?.downReason,
    );

    if (result.ok) {
      toast.success(result.message);
      document.getElementById('closeModalNewEdit')?.click();
      await getHistoryDetail();
    } else {
      toast.error(result.message || t('Messages.ErrorUpdate'));
    }
  } else {
    const result = await editServiceHistory(
      modalRegDetail.value?.id,
      modalRegDetail.value?.dateStart,
      modalRegDetail.value?.dateDown,
      modalRegDetail.value?.downReason,
    );

    if (result.ok) {
      toast.success(result.message);
      document.getElementById('closeModalNewEdit')?.click();
      await getHistoryDetail();
    } else {
      toast.error(result.message || t('Messages.ErrorUpdate'));
    }
  }

  loading.value = false;
  desactivateSpinner();
};

const resultUpdate = (res: { ok: boolean; message?: string }) => {
  if (res.ok) {
    toast.success(res.message);
  } else {
    toast.error(res.message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
};

const changeInternalNum = async () => {
  if (
    !bombDetails.value.internalNum ||
    bombDetails.value.internalNum.trim() === '' ||
    isNaN(Number(bombDetails.value.internalNum))
  ) {
    toast.error(t('Validations.InternalNumField'));
    return;
  }

  activeSpinner(t('Messages.Update'));

  const result = await changeIntNum(route.params.id as string, bombDetails.value.internalNum);
  resultUpdate(result);
};

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
      dateDown: entry.dateDown || '',
      downReason: entry.downReason,
    }));
  } else {
    toast.error(message || t('Messages.ErrorLoading'));
  }
};

watch(
  () => bombDetails.value.role,
  async (newVal) => {
    if (loading.value === true) return;

    activeSpinner(t('Messages.Update'));

    const result = await changeRole(route.params.id as string, newVal || 0);
    resultUpdate(result);
  },
  { immediate: true },
);

watch(
  () => bombDetails.value.isActive,
  async () => {
    if (loading.value === true) return;

    activeSpinner(t('Messages.Update'));

    const result = await changeStatus(route.params.id as string);
    resultUpdate(result);
  },
  { immediate: true },
);

watch(
  () => bombDetails.value.isDriver,
  async () => {
    if (loading.value === true) return;

    activeSpinner(t('Messages.Update'));

    const result = await changeDriverStatus(route.params.id as string);
    resultUpdate(result);
  },
  { immediate: true },
);
</script>

<style scoped>
[data-bs-theme='dark'] .btn-close-white-themed {
  filter: invert(1) brightness(1);
}

.modal-body :deep(.form-control:focus) {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--brand-primary-rgb), 0.15) !important;
}
</style>
