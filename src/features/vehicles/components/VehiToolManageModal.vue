<template>
  <div
    class="modal fade"
    id="vehiToolManageModal"
    tabindex="-1"
    aria-hidden="true"
    aria-labelledby="vehiToolManageModalTitle"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div
        class="modal-content border border-secondary-subtle shadow-lg bg-body-tertiary custom-modal-tactical"
      >
        <div class="modal-header border-bottom border-secondary-subtle py-3 px-4">
          <h1
            id="vehiToolManageModalTitle"
            class="modal-title fs-5 fw-bold text-body d-flex align-items-center gap-2"
          >
            <i class="bi bi-calendar-event text-orange-fire"></i>
            {{ t('VehiclesViews.ManageVehiToolTitle') }}
          </h1>

          <button
            type="button"
            class="btn-close btn-close-themed"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <form @submit.prevent="confAction" id="vehiToolManageForm" class="row g-3">
          <div class="modal-body py-4 px-4 text-body">
            <div class="row g-3">
              <FieldReadOnly
                v-if="id"
                :labelText="$t('FormField.Name')"
                :valueText="toolVehiDetails!.name"
                class-base="col-12"
              />

              <FieldReadOnly
                v-if="id"
                :labelText="$t('FormField.Mark')"
                :valueText="toolVehiDetails!.mark"
                class-base="col-12"
              />

              <FieldSelector
                v-if="!id"
                :label-text="$t('FormField.Type')"
                :options-list="toolTypeList"
                :is-required="true"
                v-model:option="toolTypeSelected"
                field-name="modalToolType"
                :is-login-form="true"
                class-base="col-12"
              />

              <FieldSelector
                v-if="!id"
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
                  id ? toolVehiDetails?.stock.toString() : vehiToolModalDet.stockCant?.toString()
                "
                :class-base="id ? 'col-6' : 'col-12'"
              />

              <FieldReadOnly
                v-if="id"
                :label-text="$t('FormField.VehiCount')"
                :valueText="toolVehiDetails!.quantity?.toString()"
                class-base="col-6"
              />

              <div class="col-12 d-flex">
                <div v-if="id" class="col-6 d-flex flex-column gap-2 ps-1">
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
                  v-if="!id || stockModeSelect !== 0"
                  :label-text="
                    stockModeSelect === 2 ? $t('FormField.DeleteCount') : $t('FormField.AddCount')
                  "
                  v-model:num-val="vehiToolModalDet.newCant"
                  field-name="modalToolMovQuantity"
                  :is-required="true"
                  :is-login-form="true"
                  :class-base="id ? 'col-6 ps-2' : 'col-12'"
                  :max-value="
                    id && stockModeSelect === 1
                      ? toolVehiDetails?.stock
                      : !id
                        ? vehiToolModalDet.stockCant
                        : toolVehiDetails?.quantity
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
            </div>
          </div>
        </form>

        <div
          class="modal-footer border-top border-secondary-subtle py-3 px-4 d-flex justify-content-end gap-2"
        >
          <button
            id="closeVehiToolManageModal"
            type="button"
            class="btn btn-sm btn-outline-secondary px-3"
            data-bs-dismiss="modal"
            @click="resetModal"
          >
            {{ $t('Buttons.Close') }}
          </button>
          <BtnConfirm type="submit" form="vehiToolManageForm" :text-detail="$t('Buttons.Save')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { onMounted, reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';

import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { getTools } from '@/features/tools/services/tools.actions';
import type { ToolsData, ToolTypeData } from '@/features/tools/interfaces/tools.interfaces';
import { getToolTypes } from '@/features/tools/services/toolType.action';
import {
  deleteVehicleTool,
  saveVehicleTool,
  updateVehicleTool,
} from '@/features/vehicles/services/vehicles.action';
import type { ToolListDet } from '@/features/vehicles/interfaces/vehicles.interfaces';

const toast = useToast();

const { t } = useI18n();
const { desactivateSpinner, activeSpinner } = useSiteConfigStore();
const { handleSubmit, resetForm } = useForm();

const id = defineModel<number | null>('id');
const toolVehiDetails = defineModel<ToolListDet | null>('toolVehiDet');

const props = withDefaults(
  defineProps<{
    idVehi: number;
  }>(),
  {
    idVehi: 0,
  },
);

const emit = defineEmits<{
  confirm: [];
}>();

const vehiToolModalDet = reactive({
  movDescription: '',
  newCant: 0,
  stockCant: 0,
});

const stockModeSelect = ref<number>(1);

const toolsListSelect = ref<{ id: number; name: string }[]>([]);
const toolsList = ref<ToolsData[]>([]);
const toolSelected = ref<number>(0);

const toolTypeSelected = ref<number>(0);
const toolTypeList = ref<{ id: number; name: string }[]>([]);

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
});

const confAction = handleSubmit(async () => {
  if (id.value) {
    if (stockModeSelect.value === 1) {
      await editVehiTool();
    }

    if (stockModeSelect.value === 2) {
      await delVehiTool();
    }
  } else {
    await addToolVehi();
  }
});

const resetModal = () => {
  vehiToolModalDet.newCant = 0;
  vehiToolModalDet.stockCant = 0;
  vehiToolModalDet.movDescription = '';
  stockModeSelect.value = 1;
  toolsList.value = [];
  toolsListSelect.value = [];
  toolSelected.value = 0;
  toolVehiDetails.value = null;
  id.value = 0;

  resetForm();
};

const addToolVehi = async () => {
  activeSpinner(t('Messages.Update'));

  const { ok, message } = await saveVehicleTool(
    props.idVehi,
    toolSelected.value,
    vehiToolModalDet.newCant,
    vehiToolModalDet.movDescription,
  );

  if (ok) {
    toast.success(message);
    resetModal();
    document.getElementById('closeVehiToolManageModal')?.click();
    emit('confirm');
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
};

const editVehiTool = async () => {
  activeSpinner(t('Messages.Update'));

  const { ok, message } = await updateVehicleTool(
    props.idVehi,
    id.value!,
    vehiToolModalDet.newCant,
    vehiToolModalDet.movDescription,
  );

  if (ok) {
    toast.success(message);
    resetModal();
    document.getElementById('closeVehiToolManageModal')?.click();
    emit('confirm');
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
};

const delVehiTool = async () => {
  activeSpinner(t('Messages.Delete'));

  const result = await deleteVehicleTool(
    id.value!,
    props.idVehi,
    vehiToolModalDet.newCant,
    vehiToolModalDet.movDescription,
  );

  if (result.ok) {
    toast.success(result.message);
    document.getElementById('closeVehiToolManageModal')?.click();
    emit('confirm');
  } else {
    toast.error(result.message || t('Messages.ErrorDelete'));
  }

  desactivateSpinner();
};

watch(
  () => toolTypeSelected.value,
  async (newVal) => {
    activeSpinner();

    toolsList.value = [];
    toolsListSelect.value = [];
    toolSelected.value = 0;

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
