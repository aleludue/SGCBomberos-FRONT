<template>
  <div class="container">
    <title>{{ $t('BombGeneric.ViewTitle') }}</title>

    <SectionTitle
      :title="$t('BombEditView.Title')"
      :subtitle="$t('BombEditView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('BomberMenuView.Title'), link: '/bomberos' },
        { detail: $t('BomberListView.Title'), link: '/bomberos/consult' },
        { detail: $t('BombEditView.Title') },
      ]"
    />

    <div class="d-flex flex-column mt-2 p-3 rounded shadow gap-2">
      <FormTitle :titleText="$t('BombEditView.PersonalData')" />

      <div class="d-flex flex-wrap row g-3 align-items-center">
        <InputReadOnly
          :label-text="$t('ProfileView.FullNameTitle')"
          :valueText="bombDetails.fullName"
        />

        <InputReadOnly :label-text="$t('ProfileView.EmailTitle')" :valueText="bombDetails.email" />

        <InputReadOnly :label-text="'Documento:'" :valueText="bombDetails.document" />

        <InputReadOnly
          :label-text="$t('ProfileView.BirthDateTitle')"
          :valueText="bombDetails.dateBirth ? bombDetails.dateBirth.toLocaleDateString() : ''"
        />

        <InputReadOnly :label-text="'Direccion:'" :valueText="bombDetails.direction" />

        <InputReadOnly
          :label-text="$t('ProfileView.CityTitle')"
          :valueText="bombDetails.locality"
        />

        <InputGender
          :label-text="$t('ProfileView.GenderTitle')"
          :gender="bombDetails.gender"
          :readonly="true"
        />

        <InputReadOnly
          :label-text="$t('ProfileView.HomePhoneTitle')"
          :valueText="bombDetails.homePhone?.toString()"
        />

        <InputReadOnly
          :label-text="$t('ProfileView.CellPhoneTitle')"
          :valueText="bombDetails.cellPhone?.toString()"
        />
      </div>

      <FormTitle :titleText="$t('BombEditView.InstitutionalConfig')" :marginTop="true" />

      <div class="alert alert-info m-0 text-center p-2" role="alert">
        Los cambios se realizan automáticamente al modificar el valor de los campos.
      </div>

      <div class="d-flex flex-wrap row g-3 align-items-center">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <InputTimeAction
            :labelText="$t('ProfileView.InternalNumTitle')"
            :valueText="bombDetails.internalNum?.toString()"
            @update:value="
              (val) => {
                bombDetails.internalNum = val ? parseInt(val) : undefined;
              }
            "
            @apply-search="changeInternalNum"
          />
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="roleForm" class="form-label">
            {{ $t('BomberListView.ColRole') }}
          </label>
          <select class="form-select" id="roleForm" v-model="bombDetails.role">
            <option value="0" selected>{{ $t('BomberListView.NoRole') }}</option>
            <option v-for="value in roleList" :key="value.id" :value="value.id">
              {{ value.name }}
            </option>
          </select>
        </div>

        <div class="col-12 d-flex flex-wrap align-items-center gap-2">
          <InputSwitch
            :labelText="'Estado en sistema:'"
            :switchState="bombDetails.isActive"
            @changeState="bombDetails.isActive = $event"
          />

          <InputSwitch
            :labelText="'¿Es conductor?'"
            :switchState="bombDetails.isDriver"
            :textActive="'Sí'"
            :textInactive="'No'"
            @changeState="bombDetails.isDriver = $event"
          />
        </div>
      </div>

      <FormTitle :titleText="$t('BombEditView.ServiceHistory')" :marginTop="true" />

      <div class="d-flex flex-wrap align-items-center gap-2">
        <button
          class="btn btn-outline-success flex-grow-1 flex-sm-grow-0"
          data-bs-toggle="modal"
          data-bs-target="#historyModal"
          @click="addHistory"
        >
          <i class="bi bi-file-earmark-plus"></i>
          Agregar
        </button>
        <button
          class="btn btn-outline-primary flex-grow-1 flex-sm-grow-0"
          :disabled="activeHistoryDet === null"
          data-bs-toggle="modal"
          data-bs-target="#historyModal"
          @click="editHistory"
        >
          <i class="bi bi-pencil-square"></i>
          Editar
        </button>
        <button
          class="btn btn-outline-danger flex-grow-1 flex-sm-grow-0"
          :disabled="activeHistoryDet === null"
          data-bs-toggle="modal"
          data-bs-target="#validActionModal"
        >
          <i class="bi bi-file-earmark-minus"></i>
          Eliminar
        </button>
      </div>

      <Table :tableHeads="tableHeads" :tableData="histoyData" @selectRow="changeSelecTable" />
    </div>

    <BtnBack :toHome="false" />

    <ModalValidAction
      titleText="Eliminar registro de historial"
      bodyText="Está a punto de eliminar un registro del historial de servicio. ¿Desea continuar?"
      @confirm="deleteHistory"
    />

    <div class="modal fade" id="historyModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Agregar/Editar Historial</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="modalStartDate" class="col-form-label">
                  Fecha inicio de servicio
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="modalStartDate"
                  placeholder="dd/mm/yyyy"
                  v-model="modalRegDetail.serviceStart"
                />
              </div>

              <div class="mb-3">
                <label for="modalEndDate" class="col-form-label"> Fecha fin de servicio </label>
                <input
                  type="date"
                  class="form-control"
                  id="modalEndDate"
                  placeholder="dd/mm/yyyy"
                  v-model="modalRegDetail.serviceEnd"
                />
              </div>

              <div class="mb-3">
                <label for="modalEndReason" class="col-form-label"> Motivo fin de servicio </label>
                <input
                  type="text"
                  class="form-control"
                  id="modalEndReason"
                  v-model="modalRegDetail.endReason"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              id="closeModalNewEdit"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {{ $t('GenericBtn.BtnClose') }}
            </button>
            <button type="button" class="btn btn-primary" @click="saveChangeHistory">
              {{ isNewHistory ? $t('GenericBtn.BtnSave') : $t('GenericBtn.BtnUpdate') }}
            </button>
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

import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import {
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
import InputTimeAction from '@/shared/components/Inputs/InputTimeAction.vue';
import InputGender from '@/shared/components/Inputs/InputGender.vue';
import InputReadOnly from '@/shared/components/Inputs/InputReadOnly.vue';
import InputSwitch from '@/shared/components/Inputs/InputSwitch.vue';

const toast = useToast();
const route = useRoute();
const configStore = useSiteConfigStore();

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
  internalNum: undefined as number | undefined,
  isDriver: false as boolean,
  isActive: false as boolean,
  role: undefined as string | undefined,
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

onMounted(async () => {
  try {
    const resRol = await getRolesList();

    if (resRol.ok && resRol.data) {
      roleList.value = resRol.data.map((role: any) => ({
        id: role.id,
        name: role.name,
      }));
    } else {
      toast.error(resRol.message || 'Error al cargar los roles');
      return;
    }

    await loadBombData();
  } catch (error) {
    toast.error((error as Error).message);
  }

  loading.value = false;
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

  try {
    const resBomb = await getBombDetail(route.params.id as string);

    if (resBomb.ok && resBomb.data) {
      bombDetails.value = {
        fullName: resBomb.data.user.fullName,
        email: resBomb.data.user.email,
        gender: resBomb.data.user.gender,
        internalNum: resBomb.data.user.internalNum,
        isDriver: resBomb.data.user.isDriver,
        isActive: resBomb.data.user.isActive,
        role: resBomb.data.user.role ?? '0',
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
  } catch (error) {
    toast.error((error as Error).message);
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

  configStore.activeSpinner(
    isNewHistory.value ? 'Guardando nuevo historial...' : 'Actualizando historial...',
  );

  try {
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
  } catch (error) {
    toast.error((error as Error).message);
  }

  loading.value = false;
  configStore.deactivateSpinner();
};

const changeInternalNum = async (newInternalNum: string) => {
  if (!bombDetails.value.internalNum) {
    toast.error('El número interno no puede estar vacío');
    return;
  }

  configStore.activeSpinner('Actualizando número interno...');

  try {
    const result = await changeIntNum(route.params.id as string, newInternalNum);

    if (result.ok) {
      toast.success('Número interno actualizado exitosamente');
    } else {
      toast.error(result.message || 'Error al actualizar el número interno');
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  configStore.deactivateSpinner();
};

watch(
  () => bombDetails.value.role,
  async (newVal) => {
    if (loading.value === true) return;

    configStore.activeSpinner('Actualizando rol del bombero...');

    try {
      const result = await changeRole(route.params.id as string, newVal || '0');

      if (result.ok) {
        toast.success('Rol actualizado exitosamente');
      } else {
        toast.error(result.message || 'Error al actualizar el rol');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }

    configStore.deactivateSpinner();
  },
  { immediate: true },
);

watch(
  () => bombDetails.value.isActive,
  async () => {
    if (loading.value === true) return;

    configStore.activeSpinner('Actualizando estado del bombero...');

    try {
      const result = await changeStatus(route.params.id as string);

      if (result.ok) {
        toast.success('Estado actualizado exitosamente');
      } else {
        toast.error(result.message || 'Error al actualizar el estado');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }

    configStore.deactivateSpinner();
  },
  { immediate: true },
);
</script>
