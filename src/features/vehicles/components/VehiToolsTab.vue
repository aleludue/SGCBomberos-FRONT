<template>
  <div class="tab-pane fade" id="tools-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column gap-2">
      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          @click="addVehiTool"
          data-bs-toggle="modal"
          data-bs-target="#vehiToolManageModal"
        />
      </div>

      <div v-if="vehiToolList" class="settings-card-container mt-2">
        <div
          class="accordion accordion-flush rounded border border-secondary-subtle overflow-hidden"
          id="accordionTools"
        >
          <div
            v-for="(tool, index) in vehiToolList"
            :key="index"
            class="accordion-item bg-transparent text-body border-0"
          >
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed fw-bold text-body bg-transparent py-3 px-4"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#collapse' + index"
                aria-expanded="false"
                :aria-controls="'collapse' + index.toString()"
              >
                <i class="bi bi-tools text-orange-fire me-2"></i> {{ tool.toolType }}
              </button>
            </h2>
            <div
              :id="'collapse' + index.toString()"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionTools"
            >
              <div class="accordion-body border-top border-secondary-subtle bg-body">
                <div class="row g-3">
                  <div v-for="toolDet in tool.toolList" :key="toolDet.id" class="col-12 col-md-6">
                    <div class="d-flex flex-row p-3 h-100 border-bottom border-secondary-subtle">
                      <div class="col-10 d-flex flex-wrap gap-3">
                        <p class="mb-0">
                          <strong>{{ t('FormField.Name') }}: </strong>{{ toolDet.name }}
                        </p>
                        <p class="mb-0">
                          <strong>{{ t('FormField.Mark') }}: </strong>{{ toolDet.mark }}
                        </p>
                        <p class="mb-0">
                          <strong>{{ t('FormField.Count') }}: </strong>{{ toolDet.quantity }}
                        </p>
                      </div>
                      <div class="col-2 d-flex justify-content-center align-items-center">
                        <button
                          class="btn btn-action-edit"
                          @click="editVehiTool(toolDet.id)"
                          data-bs-toggle="modal"
                          data-bs-target="#vehiToolManageModal"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NoRecordAlert v-else />
    </div>
  </div>

  <ModalBase
    ref="vehiToolManageModalRef"
    :title-text="t('VehiclesViews.ManageVehiToolTitle')"
    modal-name="vehiToolManageModal"
    form-name="vehiToolManageForm"
    btn-type="submit"
    :btn-text="t('Buttons.Save')"
    @cancel="resetModal"
  >
    <form @submit.prevent="confAction" id="vehiToolManageForm" class="row g-3">
      <FieldReadOnly
        v-if="selectedRowId"
        :labelText="$t('FormField.Name')"
        :valueText="selectVehiTool?.name"
        class-base="col-12"
      />

      <FieldReadOnly
        v-if="selectedRowId"
        :labelText="$t('FormField.Mark')"
        :valueText="selectVehiTool?.mark"
        class-base="col-12"
      />

      <FieldSelector
        v-if="!selectedRowId"
        :label-text="$t('FormField.Type')"
        :options-list="toolTypeList"
        :is-required="true"
        v-model:option="toolTypeSelected"
        field-name="modalToolType"
        :is-login-form="true"
        class-base="col-12"
      />

      <FieldSelector
        v-if="!selectedRowId"
        :label-text="$t('FormField.Tool')"
        :options-list="toolsListSelect"
        :is-required="true"
        v-model:option="toolSelected"
        field-name="modalTool"
        :is-login-form="true"
        class-base="col-12"
      />

      <FieldReadOnly
        :label-text="$t('FormField.StockCount')"
        :valueText="
          selectedRowId ? selectVehiTool?.stock.toString() : vehiToolModalDet.stockCant?.toString()
        "
        :class-base="selectedRowId ? 'col-6' : 'col-12'"
      />

      <FieldReadOnly
        v-if="selectedRowId"
        :label-text="$t('FormField.VehiCount')"
        :valueText="selectVehiTool?.quantity?.toString()"
        class-base="col-6"
      />

      <div class="col-12 d-flex">
        <div v-if="selectedRowId" class="col-6 d-flex flex-column gap-2 ps-1">
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="stockRadio"
              id="radioStockAdd"
              :value="1"
              v-model="stockModeSelect"
            />
            <label class="form-check-label" for="radioStockAdd">
              {{ t('Buttons.Add') }}
            </label>
          </div>

          <div class="form-check mt-2">
            <input
              class="form-check-input"
              type="radio"
              name="stockRadio"
              id="radioStockRemove"
              :value="2"
              v-model="stockModeSelect"
            />
            <label class="form-check-label" for="radioStockRemove">
              {{ t('Buttons.Remove') }}
            </label>
          </div>
        </div>

        <FieldNumber
          v-if="!selectedRowId || stockModeSelect !== 0"
          :label-text="
            stockModeSelect === 2 ? $t('FormField.DeleteCount') : $t('FormField.AddCount')
          "
          v-model:num-val="vehiToolModalDet.newCant"
          field-name="modalToolMovQuantity"
          :is-required="true"
          :is-login-form="true"
          :class-base="selectedRowId ? 'col-6 ps-2' : 'col-12'"
          :max-value="
            selectedRowId && stockModeSelect === 1
              ? selectVehiTool?.stock
              : !selectedRowId
                ? vehiToolModalDet.stockCant
                : selectVehiTool?.quantity
          "
        />
      </div>

      <FieldText
        :label-text="t('FormField.MoveStockDescription')"
        field-name="modalToolMovDesc"
        :is-required="false"
        :max-length="150"
        :is-login-form="true"
        :is-textarea="true"
        v-model:text-det="vehiToolModalDet.movDescription"
      />
    </form>
  </ModalBase>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { onMounted, reactive, ref, watch } from 'vue';
import { useForm } from 'vee-validate';

import BtnTable from '@/shared/components/Button/BtnTable.vue';
import NoRecordAlert from '@/shared/components/NoRecordAlert.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import ModalBase from '@/shared/components/ModalBase.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';

import type {
  ToolListDet,
  VehicleToolsData,
} from '@/features/vehicles/interfaces/vehicles.interfaces';
import {
  deleteVehicleTool,
  getVehicleToolsDetails,
  saveVehicleTool,
  updateVehicleTool,
} from '@/features/vehicles/services/vehicles.action';
import type { ToolsData, ToolTypeData } from '@/features/tools/interfaces/tools.interfaces';
import { getToolTypes } from '@/features/tools/services/toolType.action';
import { getTools } from '@/features/tools/services/tools.actions';

const { t } = useI18n();
const toast = useToast();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { handleSubmit, resetForm } = useForm();

const props = withDefaults(
  defineProps<{
    id: string;
  }>(),
  {
    id: '',
  },
);

const emit = defineEmits<{
  toolsCant: [toolsQuantity: number];
}>();

const vehiToolList = ref<VehicleToolsData[] | null>(null);
const selectedRowId = ref('');
const selectVehiTool = ref<ToolListDet | null>(null);

const stockModeSelect = ref<number>(1);
const toolsListSelect = ref<{ id: string; name: string }[]>([]);
const toolsList = ref<ToolsData[]>([]);
const toolSelected = ref<string>('');

const toolTypeSelected = ref<string>('');
const toolTypeList = ref<{ id: string; name: string }[]>([]);
const vehiToolManageModalRef = ref<InstanceType<typeof ModalBase> | null>(null);

const vehiToolModalDet = reactive({
  movDescription: '',
  newCant: 0,
  stockCant: 0,
});

onMounted(async () => {
  const toolTypes = await getToolTypes();

  if (toolTypes.ok && toolTypes.data) {
    toolTypeList.value = toolTypes.data.map((type: ToolTypeData) => ({
      id: type.id,
      name: type.name,
    }));
  } else {
    toast.error(toolTypes.message ?? t('Messages.ErrorLoading'));
  }

  if (props.id === '') {
    return;
  }

  await loadDataTable();
});

const loadDataTable = async () => {
  vehiToolList.value = [];
  const { ok, data, message } = await getVehicleToolsDetails(props.id);

  if (ok) {
    vehiToolList.value = data ?? [];
  } else {
    toast.error(message ?? t('Messages.ErrorLoading'));
  }
};

const addVehiTool = () => {
  resetForm();
};

const editVehiTool = async (idTool: string) => {
  if (idTool) {
    selectedRowId.value = idTool;
    let vehiToolDet = null;

    vehiToolList.value?.forEach((element) => {
      const result = element.toolList.find((x) => x.id == idTool);

      if (result) vehiToolDet = result;
    });

    selectVehiTool.value = vehiToolDet;

    resetForm();
  }
};

const confAction = handleSubmit(async () => {
  if (selectedRowId.value) {
    if (stockModeSelect.value === 1) {
      await vehiToolEdit();
    }

    if (stockModeSelect.value === 2) {
      await delVehiTool();
    }
  } else {
    await vehiToolAdd();
  }
});

const vehiToolAdd = async () => {
  activeSpinner(t('Messages.Update'));

  const { ok, message } = await saveVehicleTool(
    props.id,
    toolSelected.value,
    vehiToolModalDet.newCant,
    vehiToolModalDet.movDescription,
  );
  evalResultService(ok, message);
};

const vehiToolEdit = async () => {
  activeSpinner(t('Messages.Update'));

  const { ok, message } = await updateVehicleTool(
    props.id,
    selectedRowId.value,
    vehiToolModalDet.newCant,
    vehiToolModalDet.movDescription,
  );
  evalResultService(ok, message);
};

const delVehiTool = async () => {
  activeSpinner(t('Messages.Delete'));

  const { ok, message } = await deleteVehicleTool(
    selectedRowId.value,
    props.id,
    vehiToolModalDet.newCant,
    vehiToolModalDet.movDescription,
  );
  evalResultService(ok, message);
};

const evalResultService = async (ok: boolean, message: string | undefined) => {
  if (ok) {
    toast.success(message);
    resetModal();
    vehiToolManageModalRef.value?.close();

    activeSpinner(t('Messages.Loading'));
    await loadDataTable();
    desactivateSpinner();
  } else {
    toast.error(message || t('Messages.ErrorDelete'));
  }

  desactivateSpinner();
};

const resetModal = () => {
  vehiToolModalDet.newCant = 0;
  vehiToolModalDet.stockCant = 0;
  vehiToolModalDet.movDescription = '';
  stockModeSelect.value = 1;
  toolsList.value = [];
  toolsListSelect.value = [];
  toolSelected.value = '';

  selectVehiTool.value = null;
  selectedRowId.value = '';

  resetForm();
};

watch(
  () => vehiToolList.value,
  async (newVal) => {
    if (newVal == null) {
      emit('toolsCant', 0);
      return;
    }

    let cantReg = 0;

    newVal?.forEach((x) => {
      cantReg += x.toolList.length;
    });

    emit('toolsCant', cantReg);
  },
);

watch(
  () => toolTypeSelected.value,
  async (newVal) => {
    activeSpinner();

    toolsList.value = [];
    toolsListSelect.value = [];
    toolSelected.value = '';

    if (newVal) {
      const { ok, data } = await getTools(newVal, true, null);

      if (ok) {
        if (data) {
          toolsList.value = data.map((tool: ToolsData) => ({
            id: tool.id,
            name: tool.name,
            mark: tool.mark,
            quantity: tool.quantity,
            toolType: tool.toolType,
          }));

          toolsListSelect.value = data.map((tool: ToolsData) => ({
            id: tool.id,
            name: tool.name + ' - ' + tool.mark,
          }));
        }
      }
    }

    desactivateSpinner();
  },
);

watch(
  () => toolSelected.value,
  async (newVal) => {
    if (newVal) {
      vehiToolModalDet.newCant = 0;
      vehiToolModalDet.stockCant = toolsList.value.find((x) => x.id == newVal)?.quantity || 0;
    }
  },
);
</script>
