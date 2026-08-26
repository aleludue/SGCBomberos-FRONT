<template>
  <div
    class="modal fade"
    id="vehiDeleteModal"
    tabindex="-1"
    aria-hidden="true"
    aria-labelledby="vehiDeleteModalTitle"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div
        class="modal-content border border-secondary-subtle shadow-lg bg-body-tertiary custom-modal-tactical"
      >
        <div class="modal-header border-bottom border-secondary-subtle py-3 px-4">
          <h1
            id="vehiDeleteModalTitle"
            class="modal-title fs-5 fw-bold text-body d-flex align-items-center gap-2"
          >
            {{ t('VehiclesViews.DeleteTitle') }}
          </h1>

          <button
            id="closeVehiDeleteModal"
            type="button"
            class="btn-close btn-close-themed"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="resetModal"
          ></button>
        </div>

        <div class="modal-body py-4 px-4 text-body">
          <form @submit.prevent="confDelete" id="vehiDeleteForm" class="row g-3">
            <p>{{ t('VehiclesViews.DeleteMessage') }}</p>

            <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
              {{ t('VehiclesViews.DeleteActionWhitTools') }}
            </label>
            <div :id="uuid" class="col-12 row g-3 m-1 pe-2 d-flex flex-row">
              <div class="form-check mt-1">
                <input
                  class="form-check-input"
                  type="radio"
                  name="stockRadio"
                  id="radioToolStock"
                  :value="true"
                  v-model="stockModeSelect"
                />
                <label class="form-check-label" for="radioToolStock">
                  {{ t('VehiclesViews.DeleteActionToolStock') }}
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="stockRadio"
                  id="radioToolDelStock"
                  :value="false"
                  v-model="stockModeSelect"
                />
                <label class="form-check-label" for="radioToolDelStock">
                  {{ t('VehiclesViews.DeleteActionToolDelete') }}
                </label>
              </div>
            </div>

            <FieldText
              :label-text="t('FormField.MoveStockDescription')"
              field-name="modalVehiDelMovDesc"
              :is-required="false"
              :max-length="150"
              :is-login-form="true"
              :is-textarea="true"
              v-model:text-det="vehiModalDet.movDescription"
            />
          </form>
        </div>

        <div class="modal-footer px-4 justify-content-end">
          <BtnConfirm
            type="submit"
            form="vehiDeleteForm"
            icon="bi-check-circle"
            :text-detail="t('Buttons.Save')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { useToast } from 'vue-toastification';
import { reactive, ref, useId } from 'vue';

import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { deleteVehicle } from '@/features/vehicles/services/vehicles.action';

const { t } = useI18n();
const { desactivateSpinner, activeSpinner } = useSiteConfigStore();
const { handleSubmit, resetForm } = useForm();
const toast = useToast();
const uuid = useId();

const id = defineModel<number | null>('id');

const emit = defineEmits<{
  confirm: [];
}>();

const vehiModalDet = reactive({
  movDescription: '',
});

const stockModeSelect = ref<boolean>(true);

const confDelete = handleSubmit(async () => {
  if (id.value) {
    activeSpinner(t('Messages.Update'));

    const { ok, message } = await deleteVehicle(
      id.value,
      stockModeSelect.value,
      vehiModalDet.movDescription,
    );

    if (ok) {
      toast.success(message);
      resetModal();
      document.getElementById('closeVehiDeleteModal')?.click();
      emit('confirm');
    } else {
      toast.error(message || t('Messages.ErrorUpdate'));
    }

    desactivateSpinner();
  }
});

const resetModal = () => {
  vehiModalDet.movDescription = '';
  stockModeSelect.value = true;
  resetForm();
};
</script>
