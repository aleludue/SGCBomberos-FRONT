<template>
  <title>SGCB - Bomberos - Consulta</title>
  <div class="container">
    <SectionTitle
      title="Bomberos"
      subtitle="Pantalla de consulta de bomberos registrados en el sistema."
    />

    <BombFilter @applyFilter="filterData"></BombFilter>

    <div class="mt-3 mb-2 btn-group dropend" role="group">
      <button
        class="btn btn-outline-primary dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        :disabled="activeId === 0"
      >
        Management
      </button>
      <ul class="dropdown-menu">
        <li>
          <a
            class="dropdown-item"
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#roleModal"
            @click="loadUserRole()"
          >
            Change Rol
          </a>
        </li>
        <li><a class="dropdown-item" href="#" @click="changeStatusBomb">Change Status</a></li>
        <li>
          <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#intNumModal">
            Change Number
          </a>
        </li>
      </ul>
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

  <div class="modal fade" id="roleModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Asignar/Modificar Rol</h1>
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
              <label for="roleForm" class="col-form-label">Role:</label>
              <select class="form-select" id="roleForm" v-model="roleSelecValue">
                <option value="0" selected>No role assigned</option>
                <option v-for="value in roleList" :key="value.id" :value="value.id">
                  {{ value.name }}
                </option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            id="closeModalRole"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="changeRoleBomb()">Update</button>
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
  changeRole,
} from '@/features/bomberos/services/bomberos.action';
import { getRolesList } from '@/shared/services/generic.action';
import BombFilter from '@/features/bomberos/components/BombFilter.vue';

const configStore = useSiteConfigStore();
const toast = useToast();

const activeId = ref(0);
const actualInternalNum = ref(0);
const roleList = ref<{ id: number; name: string }[]>([]);
const roleSelecValue = ref(0);

const tableHeads = ['Full Name', 'Email', 'Number', 'Status', 'Role'];
const tableData = ref<any[]>([]);

onMounted(async () => {
  configStore.activeSpinner('Loading fire fighters...');
  await getRolesBomb();
  await loadDataTable(null, null, null);
  configStore.deactivateSpinner();
});

const changeSelecTable = (tableId: number) => {
  if (tableId) {
    const selectedData = tableData.value.find((data) => data.id === tableId);
    activeId.value = tableId;
    actualInternalNum.value = selectedData?.internalNumber || 0;
  }
};

const loadDataTable = async (
  fullName: string | null,
  internalNumber: number | null,
  isActive: boolean | null,
) => {
  tableData.value = [];
  activeId.value = 0;

  try {
    const { data } = await getInstitutionBomb(fullName, internalNumber, isActive);

    if (data) {
      tableData.value = data.map((bombero: any) => ({
        id: bombero.id,
        fullName: bombero.fullName,
        email: bombero.email,
        internalNumber: bombero.internalNum,
        isActive: bombero.isActive ? 'Active' : 'Inactive',
        role: roleList.value.find((role) => role.id === bombero.role)?.name || 'No role assigned',
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

const filterData = async (name: string | null, internal: number | null, status: boolean | null) => {
  configStore.activeSpinner('Filtering data...');
  await loadDataTable(name, internal, status);
  configStore.deactivateSpinner();
};

const getRolesBomb = async () => {
  if (roleList.value.length === 0) {
    configStore.activeSpinner('Loading roles...');

    try {
      const res = await getRolesList();

      if (res.ok && res.data) {
        roleList.value = res.data.map((role: any) => ({
          id: role.id,
          name: role.name,
        }));
      } else {
        toast.error(res.message || 'Error loading roles.');
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      configStore.deactivateSpinner();
    }
  }
};

const loadUserRole = () => {
  const selectedData = tableData.value.find((data) => data.id === activeId.value);
  if (selectedData) {
    const currentRole = roleList.value.find((role) => role.name === selectedData.role);
    roleSelecValue.value = currentRole ? currentRole.id : 0;
  }
};

const changeRoleBomb = async () => {
  if (activeId.value && activeId.value !== 0) {
    configStore.activeSpinner('Changing role...');

    try {
      var res = await changeRole(activeId.value, roleSelecValue.value);

      if (res.ok) {
        toast.success('Fire fighter role changed successfully.');
        document.getElementById('closeModalRole')?.click();
        await loadDataTable(null, null, null);
      } else {
        toast.error(res.message || 'Error changing fire fighter role.');
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
</script>
