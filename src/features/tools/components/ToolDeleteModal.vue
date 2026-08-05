<template>
  <div
    class="modal fade"
    id="toolDeleteModal"
    tabindex="-1"
    aria-hidden="true"
    aria-labelledby="toolDeleteModalTitle"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div
        class="modal-content border border-secondary-subtle shadow-lg bg-body-tertiary custom-modal-tactical"
      >
        <div class="modal-header border-bottom border-secondary-subtle py-3 px-4">
          <h1
            id="toolDeleteModalTitle"
            class="modal-title fs-5 fw-bold text-body d-flex align-items-center gap-2"
          >
            <i class="bi bi-calendar-event text-orange-fire"></i>
            {{ t('ToolsViews.DeleteToolTitle') }}
          </h1>

          <button
            type="button"
            class="btn-close btn-close-themed"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <form @submit.prevent="confDelete" id="toolDeleteForm" class="row g-3">
          <div class="modal-body py-4 px-4 text-body">
            <div class="row g-3">
              <p class="m-0 text-secondary-themed fw-medium">
                {{ t('ToolsViews.DeleteToolMessage') }}
              </p>

              <FieldReadOnly
                :label-text="$t('FormField.ActualCount')"
                :valueText="cant?.toString()"
                class-base="col-6"
              />

              <FieldNumber
                :label-text="$t('FormField.DeleteCount')"
                v-model:num-val="cantDelete"
                field-name="modalToolMovQuantity"
                :is-required="true"
                :is-login-form="true"
                class-base="col-6"
              />

              <FieldText
                :label-text="t('FormField.Description')"
                field-name="modalToolMovDesc"
                :is-required="false"
                :max-length="150"
                :is-login-form="true"
                :is-textarea="true"
                v-model:text-det="movDescription"
              />
            </div>
          </div>
        </form>

        <div
          class="modal-footer border-top border-secondary-subtle py-3 px-4 d-flex justify-content-end gap-2"
        >
          <button
            id="closetoolDeleteModal"
            type="button"
            class="btn btn-sm btn-outline-secondary px-3"
            data-bs-dismiss="modal"
          >
            {{ $t('Buttons.Close') }}
          </button>
          <BtnConfirm type="submit" form="toolDeleteForm" class="px-4 fw-bold shadow-sm">
            <i class="bi bi-check-circle me-1"></i>
            {{ $t('Buttons.Delete') }}
          </BtnConfirm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { deleteTool } from '@/features/tools/services/tools.actions';

const { t } = useI18n();
const { desactivateSpinner, activeSpinner } = useSiteConfigStore();
const { handleSubmit } = useForm();
const toast = useToast();

const id = defineModel<number | null>('id');
const cant = defineModel<number | null>('cant');

const emit = defineEmits<{
  confirm: [];
}>();

const movDescription = ref('');
const cantDelete = ref(0);

const confDelete = handleSubmit(async () => {
  debugger;
  if (id.value && id.value > 0 && cantDelete.value && cantDelete.value > 0) {
    activeSpinner(t('Messages.Delete'));

    const result = await deleteTool(id.value, cantDelete.value, movDescription.value);

    if (result.ok) {
      toast.success(result.message);
      document.getElementById('closetoolDeleteModal')?.click();

      movDescription.value = '';
      cantDelete.value = 0;
      emit('confirm');
    } else {
      toast.error(result.message || t('Messages.ErrorDelete'));
    }

    desactivateSpinner();
  }
});
</script>
