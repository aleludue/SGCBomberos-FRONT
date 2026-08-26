<template>
  <ModalBase
    ref="vehiDeleteModalRef"
    :title-text="t('VehiclesViews.DeleteTitle')"
    modal-name="vehiDeleteModal"
    form-name="vehiDeleteForm"
    btn-type="submit"
    :btn-text="t('Buttons.Save')"
    @cancel="resetModal"
  >
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
  </ModalBase>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { useToast } from 'vue-toastification';
import { reactive, ref, useId } from 'vue';

import FieldText from '@/shared/components/Inputs/FieldText.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import ModalBase from '@/shared/components/ModalBase.vue';

import { deleteVehicle } from '@/features/vehicles/services/vehicles.action';

const { t } = useI18n();
const { desactivateSpinner, activeSpinner } = useSiteConfigStore();
const { handleSubmit, resetForm } = useForm();
const toast = useToast();
const uuid = useId();

const id = defineModel<number | null>('id');
const vehiDeleteModalRef = ref<InstanceType<typeof ModalBase> | null>(null);

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
      vehiDeleteModalRef.value?.close();
      emit('confirm');
    } else {
      toast.error(message || t('Messages.ErrorUpdate'));
    }

    desactivateSpinner();
  }
});

const resetModal = () => {
  stockModeSelect.value = true;
  resetForm();
};
</script>
