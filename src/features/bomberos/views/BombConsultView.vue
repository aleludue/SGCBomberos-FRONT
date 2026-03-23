<template>
  <title>SGCB - Bomberos</title>
  <div class="container">
    <SectionTitle
      title="Bomberos"
      subtitle="Pantalla de consulta de bomberos registrados en el sistema."
    />

    <div class="col-12 mt-3 border">
      <div class="accordion accordion-flush" id="accordionFilters">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseFilters"
              aria-expanded="false"
              aria-controls="flush-collapseFilters"
            >
              Filtros
            </button>
          </h2>
          <div
            id="flush-collapseFilters"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionFilters"
          >
            <div class="accordion-body">
              <form class="d-flex flex-row gap-3 mb-2" @submit.prevent="">
                <div class="col-3">
                  <label for="filterFullName" class="col-form-label">Full Name:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="filterFullName"
                    v-model="filterFullName"
                  />
                </div>
                <div class="col-3">
                  <label for="filterInterNumber" class="col-form-label">Internal Number:</label>
                  <input
                    type="number"
                    class="form-control"
                    id="filterInterNumber"
                    v-model="filterInternalNum"
                  />
                </div>
                <div class="col-3">
                  <label for="filterStatus" class="col-form-label">Status:</label>
                  <select class="form-control" id="filterStatus" v-model="filterStatus">
                    <option value="All">Todos</option>
                    <option value="Active">Activo</option>
                    <option value="Inactive">Inactivo</option>
                  </select>
                </div>
                <div class="col-3 d-flex align-self-end justify-content-center gap-2">
                  <button class="btn btn-outline-primary" @click="filterData">Filtrar</button>
                  <button class="btn btn-outline-secondary" @click="filterClear">Limpiar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-3 mb-2 d-flex flex-wrap gap-2">
      <button class="btn btn-outline-primary" :disabled="!btnGeneric">Definir Rol</button>
      <button class="btn btn-outline-primary" :disabled="!btnGeneric" @click="changeStatusBomb">
        Activar/Desactivar
      </button>
      <button
        class="btn btn-outline-primary"
        :disabled="!btnIntNum"
        data-bs-toggle="modal"
        data-bs-target="#intNumModal"
      >
        Asignar Numero Interno
      </button>
    </div>

    <Table :tableHeads="tableHeads" :tableData="tableData" @selectRow="changeSelecTable" />

    <BtnBack :toHome="false" />
  </div>

  <div class="modal fade" id="intNumModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Asignar/Modificar Número Interno</h1>
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
              <label for="internal-number" class="col-form-label">Internal Number:</label>
              <input
                type="number"
                class="form-control"
                id="internal-number"
                v-model="actualInternalNum"
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            id="closeModalIntNum"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="changeIntNumBomb(actualInternalNum)"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';

import Table from '@/shared/components/Table.vue';
import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import {
  getInstitutionBomb,
  changeStatus,
  changeIntNum,
} from '@/features/bomberos/services/bomberos.action';

const configStore = useSiteConfigStore();
const toast = useToast();

const btnIntNum = ref(false);
const btnGeneric = ref(false);
const activeId = ref(0);
const actualInternalNum = ref(0);
const filterFullName = ref('');
const filterInternalNum = ref('');
const filterStatus = ref('All');

const tableHeads = ['Full Name', 'Email', 'Internal Number', 'Status'];
const tableData = ref<any[]>([]);

onMounted(async () => {
  configStore.activeSpinner('Loading fire fighters...');
  await loadDataTable(null, null, null);
  configStore.deactivateSpinner();
});

const changeSelecTable = (tableId: number) => {
  if (!tableId) {
    btnIntNum.value = false;
    btnGeneric.value = false;
    return;
  }

  const selectedData = tableData.value.find((data) => data.id === tableId);
  btnIntNum.value = true;
  btnGeneric.value = true;
  activeId.value = tableId;
  actualInternalNum.value = selectedData?.internalNumber || 0;
};

const loadDataTable = async (
  fullName: string | null,
  internalNumber: number | null,
  isActive: boolean | null,
) => {
  tableData.value = [];

  try {
    const { data } = await getInstitutionBomb(fullName, internalNumber, isActive);

    if (data) {
      tableData.value = data.map((bombero: any) => ({
        id: bombero.id,
        fullName: bombero.fullName,
        email: bombero.email,
        internalNumber: bombero.internalNum,
        isActive: bombero.isActive ? 'Active' : 'Inactive',
      }));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }
};

const changeStatusBomb = async () => {
  if (activeId.value && activeId.value !== 0) {
    configStore.activeSpinner('Changing status...');

    try {
      var res = await changeStatus(activeId.value);

      if (res.ok) {
        toast.success('Fire fighter status changed successfully.');
        await loadDataTable(null, null, null);
      } else {
        toast.error(res.message || 'Error changing fire fighter status.');
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      configStore.deactivateSpinner();
    }
  } else {
    toast.error('Fire fighter not selected.');
  }
};

const changeIntNumBomb = async (intNum: number) => {
  if (activeId.value && activeId.value !== 0) {
    configStore.activeSpinner('Changing internal number...');

    try {
      var res = await changeIntNum(activeId.value, intNum);

      if (res.ok) {
        toast.success('Fire fighter internal number changed successfully.');
        document.getElementById('closeModalIntNum')?.click();
        await loadDataTable(null, null, null);
      } else {
        toast.error(res.message || 'Error changing fire fighter internal number.');
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      configStore.deactivateSpinner();
    }
  } else {
    toast.error('Fire fighter not selected.');
  }
};

const filterClear = async () => {
  configStore.activeSpinner('Clearing data...');

  filterFullName.value = '';
  filterInternalNum.value = '';
  filterStatus.value = 'All';

  await loadDataTable(null, null, null);
  configStore.deactivateSpinner();
};

const filterData = async () => {
  configStore.activeSpinner('Filtering data...');

  const isActive = filterStatus.value === 'All' ? null : filterStatus.value === 'Active';
  const internalNum = filterInternalNum.value ? Number(filterInternalNum.value) : null;
  await loadDataTable(filterFullName.value || null, internalNum, isActive);

  configStore.deactivateSpinner();
};
</script>
