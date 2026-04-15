<template>
  <title>{{ $t('BombGeneric.ViewTitle') }}</title>
  <div class="container">
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

    <div class="mt-2 p-3 rounded shadow gap-2 d-flex flex-column">
      <FormTitle :titleText="$t('BombEditView.SectionTitle')" />

      <div class="d-flex flex-wrap row g-3 align-items-center">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="detFullName" class="form-label">
            {{ $t('ProfileView.FullNameTitle') }}
          </label>
          <input
            readonly
            v-model="bombDetails.fullName"
            type="text"
            class="form-control"
            id="detFullName"
          />
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="detEmail" class="form-label">
            {{ $t('ProfileView.EmailTitle') }}
          </label>
          <input
            readonly
            v-model="bombDetails.email"
            type="text"
            class="form-control"
            id="detEmail"
          />
        </div>
      </div>

      <FormTitle :titleText="$t('BombEditView.InstitutionalConfig')" :marginTop="true" />

      <div class="d-flex flex-wrap row g-3 align-items-center">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="detIntNum" class="form-label">
            {{ $t('ProfileView.InternalNumTitle') }}
          </label>
          <input type="text" class="form-control" id="detIntNum" :value="bombDetails.internalNum" />
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="detRole" class="form-label"> Role </label>
          <select class="form-select" id="roleForm" v-model="bombDetails.role">
            <option value="0" selected>{{ $t('BomberListView.NoRole') }}</option>
            <option v-for="value in roleList" :key="value.id" :value="value.name">
              {{ value.name }}
            </option>
          </select>
        </div>
      </div>

      <FormTitle :titleText="$t('BombEditView.ServiceHistory')" :marginTop="true" />

      <div class="d-flex align-items-center gap-2">
        <button
          class="btn btn-outline-success"
          data-bs-toggle="modal"
          data-bs-target="#historyModal"
          @click="addHistory"
        >
          <i class="bi bi-file-earmark-plus"></i>
          Agregar
        </button>
        <button
          class="btn btn-outline-primary"
          :disabled="activeHistoryDet === null"
          data-bs-toggle="modal"
          data-bs-target="#historyModal"
          @click="editHistory"
        >
          <i class="bi bi-pencil-square"></i>
          Editar
        </button>
        <button
          class="btn btn-outline-danger"
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
  </div>

  <ModalValidAction
    TitleText="Eliminar registro de historial"
    BodyText="Está a punto de eliminar un registro del historial de servicio. ¿Desea continuar?"
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
              <label for="modalStartDate" class="col-form-label"> Fecha inicio de servicio </label>
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';

import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import {
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
  isActive: undefined as boolean | undefined,
  role: undefined as string | undefined,
});

const tableHeads = ['Fecha inicio de servicio', 'Fecha fin de servicio', 'Motivo fin de servicio'];

const histoyData = ref<HistoryDetail[]>([]);
const activeHistoryDet = ref<HistoryDetail | null>(null);
const modalRegDetail = ref<HistoryDetail>({
  id: 0,
  serviceStart: '',
  serviceEnd: '',
  endReason: '',
});
const isNewHistory = ref(false);

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
});

const loadBombData = async () => {
  bombDetails.value = {
    fullName: undefined,
    email: undefined,
    internalNum: undefined,
    isActive: undefined,
    role: undefined,
  };

  histoyData.value = [];
  activeHistoryDet.value = null;

  try {
    const resBomb = await getBombDetail(route.params.id as string);

    if (resBomb.ok && resBomb.data) {
      bombDetails.value = {
        fullName: resBomb.data.user.fullName,
        email: resBomb.data.user.email,
        internalNum: resBomb.data.user.internalNum,
        isActive: resBomb.data.user.isActive,
        role: resBomb.data.user.role ?? '0',
      };

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
  }
};

const saveChangeHistory = async () => {
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

  configStore.deactivateSpinner();
};
</script>
