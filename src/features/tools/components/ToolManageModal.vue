<template>
  <ModalBase
    ref="toolManageModalRef"
    :title-text="t('ToolsViews.ManageToolTitle')"
    title-icon="bi-pencil-square"
    modal-name="toolManageModal"
    form-name="toolManageForm"
    btn-type="submit"
    :btn-text="t('Buttons.Save')"
    @cancel="cancelModal"
  >
    <form @submit.prevent="confAction" id="toolManageForm" class="row g-3">
      <FieldText
        :label-text="t('FormField.Name')"
        field-name="modalToolName"
        :is-required="true"
        :max-length="100"
        v-model:text-det="toolModalDet.name"
        :is-login-form="true"
      />

      <FieldText
        :label-text="t('FormField.Mark')"
        field-name="modalToolMark"
        :is-required="true"
        :max-length="100"
        v-model:text-det="toolModalDet.mark"
        :is-login-form="true"
      />

      <FieldSelector
        :label-text="t('FormField.Type')"
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
            <label class="form-check-label" for="radioStockNoChange">No modificar stock</label>
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
            :label-text="t('FormField.ActualCount')"
            :valueText="toolModalDet.cant?.toString()"
            class-base="col-12"
          />

          <FieldNumber
            v-if="!id || stockModeSelect !== 0"
            :label-text="
              stockModeSelect === 2
                ? t('FormField.DeleteCount')
                : stockModeSelect === 0
                  ? t('FormField.Count')
                  : t('FormField.AddCount')
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
    </form>
  </ModalBase>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';

import ModalBase from '@/shared/components/ModalBase.vue';
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
const toolManageModalRef = ref<InstanceType<typeof ModalBase> | null>(null);

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
  cancel: [];
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
  stockModeSelect.value = 0;
  resetForm();
};

const cancelModal = () => {
  resetForm();
  emit('cancel');
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
  evalServiceResult(ok, message);
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
    evalServiceResult(ok, message);
  }
};

const delTool = async () => {
  if (id.value && toolModalDet.newCant && toolModalDet.newCant > 0) {
    activeSpinner(t('Messages.Update'));

    const { ok, message } = await deleteTool(
      id.value,
      toolModalDet.newCant,
      toolModalDet.movDescription,
    );
    evalServiceResult(ok, message);
  }
};

const evalServiceResult = async (ok: boolean, message: string | undefined) => {
  if (ok) {
    toast.success(message);
    resetModal();
    toolManageModalRef.value?.close();
    emit('confirm');
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
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
