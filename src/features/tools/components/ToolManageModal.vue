<template>
  <div
    class="modal fade"
    id="toolManageModal"
    tabindex="-1"
    aria-hidden="true"
    aria-labelledby="toolManageModalTitle"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div
        class="modal-content border border-secondary-subtle shadow-lg bg-body-tertiary custom-modal-tactical"
      >
        <div class="modal-header border-bottom border-secondary-subtle py-3 px-4">
          <h1
            id="toolManageModalTitle"
            class="modal-title fs-5 fw-bold text-body d-flex align-items-center gap-2"
          >
            <i class="bi bi-calendar-event text-orange-fire"></i>
            {{ t('ToolsViews.ManageToolTitle') }}
          </h1>

          <button
            type="button"
            class="btn-close btn-close-themed"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <form @submit.prevent="confAction" id="toolManageForm" class="row g-3">
          <div class="modal-body py-4 px-4 text-body">
            <div class="row g-3">
              <FieldText
                :label-text="$t('FormField.Name')"
                field-name="modalToolName"
                :is-required="true"
                :max-length="100"
                v-model:text-det="toolModalDet.name"
                :is-login-form="true"
              />

              <FieldText
                :label-text="$t('FormField.Mark')"
                field-name="modalToolMark"
                :is-required="true"
                :max-length="100"
                v-model:text-det="toolModalDet.mark"
                :is-login-form="true"
              />

              <FieldSelector
                :label-text="$t('FormField.Type')"
                :options-list="props.typeList"
                :is-required="true"
                v-model:option="toolModalDet.typeId"
                field-name="modalToolType"
                :is-login-form="true"
                class-base="col-12"
              />

              <div :class="id ? 'col-12 row g-3 m-1 p-1' : 'col-12'">
                <div
                  v-if="id"
                  class="col-6 d-flex flex-column justify-content-between border rounded-3 p-3 gap-2"
                >
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="stockRadio"
                      id="radioStockNoChange"
                      :value="0"
                      v-model="stockModeSelect"
                    />
                    <label class="form-check-label" for="radioStockNoChange"
                      >No modificar stock</label
                    >
                  </div>

                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="stockRadio"
                      id="radioStockAdd"
                      :value="1"
                      v-model="stockModeSelect"
                    />
                    <label class="form-check-label" for="radioStockAdd">Agregar</label>
                  </div>

                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="stockRadio"
                      id="radioStockRemove"
                      :value="2"
                      v-model="stockModeSelect"
                    />
                    <label class="form-check-label" for="radioStockRemove">Quitar</label>
                  </div>
                </div>

                <div :class="id ? 'col-6 d-flex flex-column gap-3' : ''">
                  <FieldReadOnly
                    v-if="id"
                    :label-text="$t('FormField.ActualCount')"
                    :valueText="toolModalDet.cant?.toString()"
                    class-base="col-12"
                  />

                  <FieldNumber
                    v-if="!id || stockModeSelect !== 0"
                    :label-text="
                      stockModeSelect === 2
                        ? $t('FormField.DeleteCount')
                        : stockModeSelect === 0
                          ? $t('FormField.Count')
                          : $t('FormField.AddCount')
                    "
                    v-model:num-val="toolModalDet.newCant"
                    field-name="modalToolMovQuantity"
                    :is-required="true"
                    :is-login-form="true"
                    :class-base="id ? 'col-12' : ''"
                  />
                </div>
              </div>

              <FieldText
                v-if="stockModeSelect !== 0"
                :label-text="t('FormField.MoveStockDescription')"
                field-name="modalToolMovDesc"
                :is-required="false"
                :max-length="150"
                :is-login-form="true"
                :is-textarea="true"
                v-model:text-det="toolModalDet.movDescription"
              />
            </div>
          </div>
        </form>

        <div
          class="modal-footer border-top border-secondary-subtle py-3 px-4 d-flex justify-content-end gap-2"
        >
          <button
            id="closeToolManageModal"
            type="button"
            class="btn btn-sm btn-outline-secondary px-3"
            data-bs-dismiss="modal"
            @click="resetModal"
          >
            {{ $t('Buttons.Close') }}
          </button>
          <BtnConfirm type="submit" form="toolManageForm" class="px-4 fw-bold shadow-sm">
            <i class="bi bi-check-circle me-1"></i>
            {{ $t('Buttons.Save') }}
          </BtnConfirm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';

import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { deleteTool, saveTool, updateTool } from '@/features/tools/services/tools.actions';
import type { ToolSaveData, ToolsData } from '@/features/tools/interfaces/tools.interfaces';

const { t } = useI18n();
const { desactivateSpinner, activeSpinner } = useSiteConfigStore();
const { handleSubmit, resetForm } = useForm();
const toast = useToast();

const id = defineModel<number | null>('id');
const toolDetails = defineModel<ToolsData | null>('toolDet');

const props = withDefaults(
  defineProps<{
    typeList: { id: number; name: string }[];
  }>(),
  {
    typeList: () => [],
  },
);

const emit = defineEmits<{
  confirm: [];
}>();

const toolModalDet = reactive({
  name: '',
  mark: '',
  cant: 0,
  typeId: 0,
  movDescription: '',
  newCant: 0,
});

const stockModeSelect = ref<number>(0);

const confAction = handleSubmit(async () => {
  if (id.value) {
    if (
      stockModeSelect.value === 1 ||
      toolDetails.value?.mark !== toolModalDet.mark ||
      toolDetails.value?.name !== toolModalDet.name ||
      toolDetails.value?.toolType !== props.typeList.find((t) => t.id === toolModalDet.typeId)?.name
    ) {
      await editTool();
    }

    if (stockModeSelect.value === 2) {
      await delTool();
    }
  } else {
    await regTool();
  }
});

const resetModal = () => {
  toolModalDet.name = '';
  toolModalDet.mark = '';
  toolModalDet.cant = 0;
  toolModalDet.typeId = 0;
  toolModalDet.newCant = 0;
  toolModalDet.movDescription = '';
  stockModeSelect.value = 0;

  resetForm();
};

const regTool = async () => {
  activeSpinner(t('Messages.Update'));

  const req: ToolSaveData = {
    typeId: toolModalDet.typeId,
    name: toolModalDet.name,
    mark: toolModalDet.mark,
    quantity: toolModalDet.newCant,
    movDescription: toolModalDet.movDescription,
  };

  const { ok, message } = await saveTool(req);

  if (ok) {
    toast.success(message);
    resetModal();
    document.getElementById('closeToolManageModal')?.click();
    emit('confirm');
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
};

const editTool = async () => {
  if (id.value) {
    activeSpinner(t('Messages.Update'));

    const req: ToolSaveData = {
      typeId: toolModalDet.typeId,
      name: toolModalDet.name,
      mark: toolModalDet.mark,
      quantity: stockModeSelect.value === 1 ? toolModalDet.newCant : 0,
      movDescription: stockModeSelect.value === 1 ? toolModalDet.movDescription : '',
    };

    const { ok, message } = await updateTool(id.value, req);

    if (ok) {
      toast.success(message);
      resetModal();
      document.getElementById('closeToolManageModal')?.click();
      emit('confirm');
    } else {
      toast.error(message || t('Messages.ErrorUpdate'));
    }

    desactivateSpinner();
  }
};

const delTool = async () => {
  if (id.value && toolModalDet.newCant && toolModalDet.newCant > 0) {
    activeSpinner(t('Messages.Update'));

    const result = await deleteTool(id.value, toolModalDet.newCant, toolModalDet.movDescription);

    if (result.ok) {
      toast.success(result.message);
      resetModal();
      document.getElementById('closeToolManageModal')?.click();
      emit('confirm');
    } else {
      toast.error(result.message || t('Messages.ErrorUpdate'));
    }

    desactivateSpinner();
  }
};

watch(
  () => toolDetails.value,
  (newVal) => {
    if (newVal) {
      toolModalDet.name = newVal.name;
      toolModalDet.mark = newVal.mark;
      toolModalDet.cant = newVal.quantity;
      toolModalDet.typeId = props.typeList.find((t) => t.name === newVal.toolType)?.id || 0;
    } else {
      resetModal();
    }
  },
  { immediate: true },
);
</script>
