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
        <FieldReadOnly :label-text="'Documento:'" :valueText="bombDetails.document" />
        <FieldReadOnly
          :label-text="$t('FormField.BirthDate')"
          :valueText="bombDetails.dateBirth ? bombDetails.dateBirth.toLocaleDateString() : ''"
        />
        <FieldReadOnly :label-text="'Direccion:'" :valueText="bombDetails.direction" />
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
        <span>Los cambios se realizan automáticamente al modificar el valor de los campos.</span>
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
          :base-option-text="'Sin rol asignado'"
          field-name="rolSelect"
        />

        <div class="col-12 d-flex flex-wrap align-items-top gap-3 mt-2">
          <FieldSwitch :labelText="'Estado en sistema:'" v-model="bombDetails.isActive" />
          <FieldSwitch
            :labelText="'¿Es conductor?'"
            v-model="bombDetails.isDriver"
            :textActive="'Sí'"
            :textInactive="'No'"
          />
        </div>
      </div>

      <div class="d-flex flex-column gap-2">
        <FormTitle :titleText="$t('FormSections.ServiceHistory')" />

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
      titleText="Eliminar registro de historial"
      bodyText="Está a punto de eliminar un registro del historial de servicio. ¿Desea continuar?"
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
              Agregar/Editar Historial
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
                  Fecha inicio de servicio
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="modalStartDate"
                  v-model="modalRegDetail.serviceStart"
                />
              </div>
              <div class="col-12">
                <label for="modalEndDate" class="form-label small fw-bold text-secondary">
                  Fecha fin de servicio
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="modalEndDate"
                  v-model="modalRegDetail.serviceEnd"
                />
              </div>
              <div class="col-12">
                <label for="modalEndReason" class="form-label small fw-bold text-secondary">
                  Motivo fin de servicio
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="modalEndReason"
                  v-model="modalRegDetail.endReason"
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
            <BtnSubmit type="button" class="px-4 fw-bold shadow-sm" @click="saveChangeHistory">
              <i class="bi bi-check-circle me-1"></i>
              {{ isNewHistory ? $t('Buttons.Save') : $t('Buttons.Update') }}
            </BtnSubmit>
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

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import BtnSubmit from '@/shared/components/button/BtnSubmit.vue';
import {
  changeDriverStatus,
  changeIntNum,
  changeRole,
  changeStatus,
  deleteServiceHistory,
  editServiceHistory,
  getBombDetail,
  saveServiceHistory,
} from '@/features/bomberos/services/bomberos.action';
import { getRolesList } from '@/shared/services/generic.action';
import Table from '@/shared/components/Table.vue';
import ModalValidAction from '@/shared/components/ModalValidAction.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { localDateToIso } from '@/shared/utils/genericFuntions';
import FormTitle from '@/shared/components/FormTitle.vue';
import FieldTimeAction from '@/shared/components/Inputs/FieldTimeAction.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import FieldSwitch from '@/shared/components/Inputs/FieldSwitch.vue';
import { genericOptionsList } from '@/shared/composables/genericOptionList';
import BtnTable from '@/shared/components/Button/BtnTable.vue';

const toast = useToast();
const route = useRoute();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();

interface HistoryDetail {
  id: number;
  serviceStart: string;
  serviceEnd?: string;
  endReason?: string;
}

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
  dateBirth: undefined as Date | undefined,
  direction: undefined as string | undefined,
  locality: undefined as string | undefined,
  cellPhone: undefined as string | undefined,
  homePhone: undefined as string | undefined,
});

const tableHeads = ['Inicio servicio', 'Fin servicio', 'Motivo'];

const histoyData = ref<HistoryDetail[]>([]);
const activeHistoryDet = ref<HistoryDetail | null>(null);
const modalRegDetail = ref<HistoryDetail>({
  id: 0,
  serviceStart: '',
  serviceEnd: '',
  endReason: '',
});
const isNewHistory = ref(false);
const loading = ref(true);
const genderOptions = genericOptionsList().genderList;

onMounted(async () => {
  const resRol = await getRolesList();

  if (resRol.ok && resRol.data) {
    roleList.value = resRol.data.map((role: { id: number; name: string }) => ({
      id: role.id,
      name: role.name,
    }));
  } else {
    toast.error(resRol.message || 'Error al cargar los roles');
    return;
  }

  await loadBombData();

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

  histoyData.value = [];
  activeHistoryDet.value = null;

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
      dateBirth: resBomb.data.user.dateBirth ? new Date(resBomb.data.user.dateBirth) : undefined,
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
        bombDetails.value.direction += ' - Piso ' + resBomb.data.user.dirFloor?.toString();
      }

      if (resBomb.data.user.dirDpto) {
        bombDetails.value.direction += ' - Dpto ' + resBomb.data.user.dirDpto?.toString();
      }
    }

    histoyData.value = resBomb.data.serviceHistory.map((entry) => ({
      id: entry.id,
      serviceStart: entry.dateStart || '',
      serviceEnd: entry.dateDown || '',
      endReason: entry.downReason,
    }));
  } else {
    toast.error(resBomb.message || 'Error al cargar los datos del bombero');
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
    serviceStart: '',
    serviceEnd: '',
    endReason: '',
  };
};

const editHistory = () => {
  if (activeHistoryDet.value) {
    isNewHistory.value = false;

    modalRegDetail.value.endReason = activeHistoryDet.value.endReason || '';
    modalRegDetail.value.id = activeHistoryDet.value.id;

    modalRegDetail.value.serviceStart = localDateToIso(activeHistoryDet.value.serviceStart || '');
    modalRegDetail.value.serviceEnd = localDateToIso(activeHistoryDet.value.serviceEnd || '');
  }
};

const deleteHistory = async () => {
  if (activeHistoryDet.value) {
    loading.value = true;

    const result = await deleteServiceHistory(
      route.params.id as string,
      activeHistoryDet.value?.id,
    );

    if (result.ok) {
      toast.success('Historial eliminado exitosamente');
      document.getElementById('closeValidActionModal')?.click();
      await loadBombData();
    } else {
      toast.error(result.message || 'Error al eliminar el historial');
    }

    loading.value = false;
  }
};

const saveChangeHistory = async () => {
  loading.value = true;

  activeSpinner(isNewHistory.value ? 'Guardando nuevo historial...' : 'Actualizando historial...');

  if (isNewHistory.value) {
    const result = await saveServiceHistory(
      route.params.id as string,
      modalRegDetail.value?.serviceStart,
      modalRegDetail.value?.serviceEnd,
      modalRegDetail.value?.endReason,
    );

    if (result.ok) {
      toast.success('Historial agregado exitosamente');
      document.getElementById('closeModalNewEdit')?.click();
      await loadBombData();
    } else {
      toast.error(result.message || 'Error al guardar el historial');
    }
  } else {
    const result = await editServiceHistory(
      route.params.id as string,
      modalRegDetail.value?.id,
      modalRegDetail.value?.serviceStart,
      modalRegDetail.value?.serviceEnd,
      modalRegDetail.value?.endReason,
    );

    if (result.ok) {
      toast.success('Historial actualizado exitosamente');
      document.getElementById('closeModalNewEdit')?.click();
      await loadBombData();
    } else {
      toast.error(result.message || 'Error al actualizar el historial');
    }
  }

  loading.value = false;
  desactivateSpinner();
};

const changeInternalNum = async () => {
  if (!bombDetails.value.internalNum || bombDetails.value.internalNum.trim() === '') {
    toast.error('El número interno no puede estar vacío.');
    return;
  }

  if (isNaN(Number(bombDetails.value.internalNum))) {
    toast.error('El número interno debe ser un valor numérico.');
    return;
  }

  activeSpinner('Actualizando número interno...');

  const result = await changeIntNum(route.params.id as string, bombDetails.value.internalNum);

  if (result.ok) {
    toast.success('Número interno actualizado exitosamente');
  } else {
    toast.error(result.message || 'Error al actualizar el número interno');
  }

  desactivateSpinner();
};

watch(
  () => bombDetails.value.role,
  async (newVal) => {
    if (loading.value === true) return;

    activeSpinner('Actualizando rol del bombero...');

    const result = await changeRole(route.params.id as string, newVal || 0);

    if (result.ok) {
      toast.success('Rol actualizado exitosamente');
    } else {
      toast.error(result.message || 'Error al actualizar el rol');
    }

    desactivateSpinner();
  },
  { immediate: true },
);

watch(
  () => bombDetails.value.isActive,
  async () => {
    if (loading.value === true) return;

    activeSpinner('Actualizando estado del bombero...');

    const result = await changeStatus(route.params.id as string);

    if (result.ok) {
      toast.success('Estado actualizado exitosamente');
    } else {
      toast.error(result.message || 'Error al actualizar el estado');
    }

    desactivateSpinner();
  },
  { immediate: true },
);

watch(
  () => bombDetails.value.isDriver,
  async () => {
    if (loading.value === true) return;

    activeSpinner('Actualizando estado del bombero...');

    const result = await changeDriverStatus(route.params.id as string);

    if (result.ok) {
      toast.success('Estado actualizado exitosamente');
    } else {
      toast.error(result.message || 'Error al actualizar el estado');
    }

    desactivateSpinner();
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
