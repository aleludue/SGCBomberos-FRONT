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

      <FormAlert :text-detail="t('Messages.UpdateAutomatic')" />

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

        <FieldSelector
          :label-text="$t('FormField.Rank')"
          v-model:option="bombDetails.rank"
          :readonly="false"
          :options-list="rankList"
          :base-option-text="$t('SelectOptions.NoRank')"
          field-name="rankSelect"
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

    <BtnBack :toHome="false" />

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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';

import { getRolesList } from '@/shared/services/generic.action';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { isoToLocalDate, localDateToIso } from '@/shared/utils/genericFuntions';
import { genericOptionsList } from '@/shared/composables/genericOptionList';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import Table from '@/shared/components/Table.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import FieldTimeAction from '@/shared/components/Inputs/FieldTimeAction.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import FieldSwitch from '@/shared/components/Inputs/FieldSwitch.vue';
import BtnTable from '@/shared/components/Button/BtnTable.vue';
import FormAlert from '@/shared/components/FormAlert.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import ModalBase from '@/shared/components/ModalBase.vue';

import {
  changeDriverStatus,
  changeIntNum,
  changeRole,
  changeStatus,
  getBombDetail,
  updateRank,
} from '@/features/bomberos/services/bomberos.action';
import {
  deleteServiceHistory,
  editServiceHistory,
  getServiceHistory,
  saveServiceHistory,
} from '@/features/serviceHistory/services/serviceHistory.action';
import type { BombHistoryDetail } from '@/features/serviceHistory/interfaces/servicehistory.interfaces';
import { getRanks } from '@/features/institution/services/institution.action';

const toast = useToast();
const route = useRoute();
const { t } = useI18n();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { handleSubmit } = useForm();

const selectedRowId = ref(0);
const roleList = ref<{ id: number; name: string }[]>([]);
const rankList = ref<{ id: number; name: string }[]>([]);

const bombDetails = ref({
  fullName: undefined as string | undefined,
  email: undefined as string | undefined,
  internalNum: undefined as string | undefined,
  isDriver: false as boolean,
  isActive: false as boolean,
  role: undefined as number | undefined,
  rank: undefined as number | undefined,
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
  dateDown: undefined,
  downReason: '',
});
const isNewHistory = ref(false);
const loading = ref(true);
const genderOptions = genericOptionsList().genderList;
const bombInService = ref(false);
const deleteHistoryModalRef = ref<InstanceType<typeof ModalBase> | null>(null);
const historyModalRef = ref<InstanceType<typeof ModalBase> | null>(null);

onMounted(async () => {
  const [resRol, resRanks] = await Promise.all([getRolesList(), getRanks()]);

  if (resRol.ok && resRol.data && resRanks.ok && resRanks.data) {
    roleList.value = resRol.data;
    rankList.value = resRanks.data;
  } else {
    toast.error(t('Messages.ErrorLoading'));
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
    rank: undefined,
    gender: undefined,
    document: undefined,
    dateBirth: undefined,
    direction: undefined,
    locality: undefined,
    cellPhone: undefined,
    homePhone: undefined,
  };

  const { ok, data, message } = await getBombDetail(route.params.id as string);

  if (ok && data) {
    bombDetails.value = {
      fullName: data.fullName,
      email: data.email,
      gender: data.gender || undefined,
      internalNum: data.internalNum.toString(),
      isDriver: data.isDriver,
      isActive: data.isActive,
      role: data.role ?? 0,
      document: data.docType && data.docNum ? data.docType + ' - ' + data.docNum : undefined,
      dateBirth: data.dateBirth ? isoToLocalDate(data.dateBirth) : undefined,
      direction: undefined,
      locality:
        data.locality && data.province ? data.locality + ' (' + data.province + ')' : undefined,
      cellPhone: data.cellPhone,
      homePhone: data.homePhone,
      rank: data.rank,
    };

    if (data.direction && data.dirNumber) {
      bombDetails.value.direction = data.direction + ' ' + data.dirNumber?.toString();

      if (data.dirFloor) {
        bombDetails.value.direction +=
          ' - ' + t('FormField.StreetFloor') + ' ' + data.dirFloor?.toString();
      }

      if (data.dirDpto) {
        bombDetails.value.direction +=
          ' - ' + t('FormField.StreetDept') + ' ' + data.dirDpto?.toString();
      }
    }
  } else {
    toast.error(message || t('Messages.ErrorLoading'));
  }
};

watch(selectedRowId, (newId: number) => {
  activeHistoryDet.value = histoyData.value.find((entry) => entry.id === newId) || null;
});

const addHistory = () => {
  isNewHistory.value = true;
  modalRegDetail.value = {
    id: 0,
    dateStart: '',
    dateDown: undefined,
    downReason: '',
  };
  selectedRowId.value = 0;
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

    loading.value = true;

    const result = await deleteServiceHistory(activeHistoryDet.value?.id);

    if (result.ok) {
      toast.success(result.message);
      deleteHistoryModalRef.value?.close();
      await getHistoryDetail();
    } else {
      toast.error(result.message || t('Messages.ErrorDelete'));
    }

    loading.value = false;
    desactivateSpinner();
  }
};

const saveChangeHistory = handleSubmit(async () => {
  loading.value = true;

  activeSpinner(t('Messages.Update'));

  const { ok, message } = isNewHistory.value
    ? await saveServiceHistory(
        route.params.id as string,
        modalRegDetail.value?.dateStart,
        modalRegDetail.value?.dateDown,
        modalRegDetail.value?.downReason,
      )
    : await editServiceHistory(
        modalRegDetail.value?.id,
        modalRegDetail.value?.dateStart,
        modalRegDetail.value?.dateDown,
        modalRegDetail.value?.downReason,
      );

  if (ok) {
    toast.success(message);
    historyModalRef.value?.close();
    await getHistoryDetail();
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  loading.value = false;
  desactivateSpinner();
});

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
      dateDown: entry.dateDown || undefined,
      downReason: entry.downReason,
    }));
  } else {
    toast.error(message || t('Messages.ErrorLoading'));
  }
};

const clearSelHistory = () => {
  selectedRowId.value = 0;
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

watch(
  () => bombDetails.value.rank,
  async (newVal) => {
    if (loading.value === true) return;

    activeSpinner(t('Messages.Update'));

    const result = await updateRank(route.params.id as string, newVal?.toString() || '');
    resultUpdate(result);
  },
  { immediate: true },
);
</script>
