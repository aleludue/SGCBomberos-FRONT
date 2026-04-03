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

      <div class="d-flex align-items-stretch flex-wrap row g-3 align-items-center">
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

      <div class="d-flex align-items-stretch flex-wrap row g-3 align-items-center">
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

      <div class="d-flex align-items-stretch flex-wrap row g-3 align-items-center">
        <div class="mt-3">
          <button class="btn btn-outline-success" @click="addHistory">Agregar</button>
          <button
            class="btn btn-outline-primary ms-2"
            :disabled="activeHistoryId === 0"
            @click="editHistory"
          >
            Editar
          </button>
        </div>
        <Table :tableHeads="tableHeads" :tableData="histoyData" />
      </div>
    </div>

    <BtnBack :toHome="false" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';

import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { getBombDetail } from '@/features/bomberos/services/bomberos.action';
import { getRolesList } from '@/shared/services/generic.action';
import Table from '@/shared/components/Table.vue';

const toast = useToast();
const route = useRoute();

const roleList = ref<{ id: number; name: string }[]>([]);
const bombDetails = ref({
  fullName: undefined as string | undefined,
  email: undefined as string | undefined,
  internalNum: undefined as number | undefined,
  isActive: undefined as boolean | undefined,
  role: undefined as string | undefined,
});

const histoyData = ref<
  { serviceStart: string; serviceEnd: string | undefined; endReason: string | undefined }[]
>([]);

const tableHeads = ['Fecha inicio de servicio', 'Fecha fin de servicio', 'Motivo fin de servicio'];
const activeHistoryId = ref(0);

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

    const resBomb = await getBombDetail(route.params.id as string);

    if (resBomb.ok && resBomb.data) {
      roleList.value = resRol.data.map((role: any) => ({
        id: role.id,
        name: role.name,
      }));

      bombDetails.value = {
        fullName: resBomb.data.user.fullName,
        email: resBomb.data.user.email,
        internalNum: resBomb.data.user.internalNum,
        isActive: resBomb.data.user.isActive,
        role: resBomb.data.user.role ?? '0',
      };

      histoyData.value = resBomb.data.serviceHistory.map((entry) => ({
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
});

const editHistory = () => {
  if (activeHistoryId.value) {
    // Lógica para editar el historial seleccionado
  }
};

const addHistory = () => {
  // Lógica para agregar un nuevo historial
};
</script>
