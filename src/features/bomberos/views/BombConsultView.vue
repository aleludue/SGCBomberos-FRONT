<template>
  <title>{{ $t('BombGeneric.ViewTitle') }}</title>
  <div class="container">
    <SectionTitle
      :title="t('BomberListView.Title')"
      :subtitle="t('BomberListView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('BomberMenuView.Title'), link: '/bomberos' },
        { detail: $t('BomberListView.Title') },
      ]"
    />

    <BombFilter @applyFilter="filterData"></BombFilter>

    <div class="mt-3 mb-2">
      <button class="btn btn-outline-primary" :disabled="activeId === 0" @click="editBomb">
        {{ $t('BomberListView.BtnManage') }}
      </button>
    </div>

    <Table :tableHeads="tableHeads" :tableData="tableData" @selectRow="changeSelecTable" />
    <BtnBack :toHome="false" />
  </div>

  <div class="modal fade" id="intNumModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">{{ $t('BomberListView.ModalNumTitle') }}</h1>
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
              <label for="internal-number" class="col-form-label">
                {{ $t('BomberListView.ColIntNum') }}
              </label>
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
            {{ $t('GenericBtn.BtnClose') }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="changeIntNumBomb(actualInternalNum)"
          >
            {{ $t('GenericBtn.BtnUpdate') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="roleModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">{{ $t('BomberListView.ModalRoleTitle') }}</h1>
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
              <label for="roleForm" class="col-form-label">{{
                $t('BomberListView.ColRole')
              }}</label>
              <select class="form-select" id="roleForm" v-model="roleSelecValue">
                <option value="0" selected>{{ $t('BomberListView.NoRole') }}</option>
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
            {{ $t('GenericBtn.BtnClose') }}
          </button>
          <button type="button" class="btn btn-primary" @click="changeRoleBomb()">
            {{ $t('GenericBtn.BtnUpdate') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

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
import router from '@/router';

const configStore = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();

const activeId = ref(0);
const actualInternalNum = ref(0);
const roleList = ref<{ id: number; name: string }[]>([]);
const roleSelecValue = ref(0);

const tableHeads = [
  t('BomberListView.ColName'),
  t('BomberListView.ColEmail'),
  t('BomberListView.ColIntNum'),
  t('BomberListView.ColStatus'),
  t('BomberListView.ColRole'),
];
const tableData = ref<any[]>([]);

onMounted(async () => {
  configStore.activeSpinner(t('BomberListView.LoadBombSpinMsg'));
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
        isActive: bombero.isActive
          ? t('BomberListView.StatusActive')
          : t('BomberListView.StatusInactive'),
        role:
          roleList.value.find((role) => role.id === bombero.role)?.name ||
          t('BomberListView.NoRole'),
      }));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }
};

const editBomb = () => {
  if (activeId.value && activeId.value !== 0) {
    router.push(`/bomberos/${activeId.value}/edit`);
  } else {
    toast.error(t('BomberListView.NoSelectedBomb'));
  }
};

const changeStatusBomb = async () => {
  if (activeId.value && activeId.value !== 0) {
    configStore.activeSpinner(t('BomberListView.SpinMsgStatus'));

    try {
      var res = await changeStatus(activeId.value);

      if (res.ok) {
        toast.success(t('BomberListView.SuccessMsgStatus'));
        await loadDataTable(null, null, null);
      } else {
        toast.error(res.message || t('BomberListView.ErrorMsgStatus'));
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      configStore.deactivateSpinner();
    }
  } else {
    toast.error(t('BomberListView.NoSelectedBomb'));
  }
};

const changeIntNumBomb = async (intNum: number) => {
  if (activeId.value && activeId.value !== 0) {
    configStore.activeSpinner(t('BomberListView.SpinMsgNum'));

    try {
      var res = await changeIntNum(activeId.value, intNum);

      if (res.ok) {
        toast.success(t('BomberListView.SuccessMsgNum'));
        document.getElementById('closeModalIntNum')?.click();
        await loadDataTable(null, null, null);
      } else {
        toast.error(res.message || t('BomberListView.ErrorMsgNum'));
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      configStore.deactivateSpinner();
    }
  } else {
    toast.error(t('BomberListView.NoSelectedBomb'));
  }
};

const filterData = async (name: string | null, internal: number | null, status: boolean | null) => {
  configStore.activeSpinner(t('BomberListView.SpinMsgFilter'));
  await loadDataTable(name, internal, status);
  configStore.deactivateSpinner();
};

const getRolesBomb = async () => {
  if (roleList.value.length === 0) {
    configStore.activeSpinner(t('BomberListView.SpinMsgRoles'));

    try {
      const res = await getRolesList();

      if (res.ok && res.data) {
        roleList.value = res.data.map((role: any) => ({
          id: role.id,
          name: role.name,
        }));
      } else {
        toast.error(res.message || t('BomberListView.ErrorMsgRoles'));
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
    configStore.activeSpinner(t('BomberListView.SpinMsgRole'));

    try {
      var res = await changeRole(activeId.value, roleSelecValue.value);

      if (res.ok) {
        toast.success(t('BomberListView.SuccessMsgRole'));
        document.getElementById('closeModalRole')?.click();
        await loadDataTable(null, null, null);
      } else {
        toast.error(res.message || t('BomberListView.ErrorMsgRole'));
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      configStore.deactivateSpinner();
    }
  } else {
    toast.error(t('BomberListView.NoSelectedBomb'));
  }
};
</script>
