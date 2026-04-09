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

    <div class="mt-2 p-3 rounded shadow">
      <div class="mb-2 d-flex align-items-center text-center">
        <hr class="flex-grow-1" />
        <h4 class="mx-3 mb-0">{{ $t('ProfileView.SectionBaseData') }}</h4>
        <hr class="flex-grow-1" />
      </div>

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

      <div class="mb-2 mt-4 d-flex align-items-center text-center">
        <hr class="flex-grow-1" />
        <h4 class="mx-3 mb-0">Config institucionales</h4>
        <hr class="flex-grow-1" />
      </div>

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

      <div class="mb-2 mt-4 d-flex align-items-center text-center">
        <hr class="flex-grow-1" />
        <h4 class="mx-3 mb-0">Historial de actividad</h4>
        <hr class="flex-grow-1" />
      </div>

      <div class="d-flex flex-wrap row g-3 align-items-center">
        <div class="btn-group" role="group" aria-label="Basic example">
          <button
            class="btn btn-outline-success"
            data-bs-toggle="modal"
            data-bs-target="#historyModal"
            @click="addHistory"
          >
            Agregar
          </button>
          <button
            class="btn btn-outline-primary ms-2"
            :disabled="activeHistoryDet === null"
            data-bs-toggle="modal"
            data-bs-target="#historyModal"
            @click="editHistory"
          >
            Editar
          </button>
          <button
            class="btn btn-outline-danger ms-2"
            :disabled="activeHistoryDet === null"
            data-bs-toggle="modal"
            data-bs-target="#validActionModal"
          >
            Eliminar
          </button>
        </div>
        <Table :tableHeads="tableHeads" :tableData="histoyData" @selectRow="changeSelecTable" />
      </div>
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
                type="text"
                class="form-control"
                id="modalStartDate"
                v-model="modalRegDetail.serviceStart"
              />
            </div>

            <div class="mb-3">
              <label for="modalEndDate" class="col-form-label"> Fecha fin de servicio </label>
              <input
                type="text"
                class="form-control"
                id="modalEndDate"
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
  editServiceHistory,
  getBombDetail,
  saveServiceHistory,
} from '@/features/bomberos/services/bomberos.action';
import { getRolesList } from '@/shared/services/generic.action';
import Table from '@/shared/components/Table.vue';
import ModalValidAction from '@/shared/components/ModalValidAction.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

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
        serviceStart: entry.dateStart,
        serviceEnd: entry.dateDown,
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
  // Lógica para agregar un nuevo historial
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
    modalRegDetail.value = { ...activeHistoryDet.value };
  }
};

const deleteHistory = () => {
  if (activeHistoryDet.value) {
    // Lógica para eliminar el historial seleccionado
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
        toast.error(result.message || 'Error al guardar el historial');
      }
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  configStore.deactivateSpinner();
};
</script>
