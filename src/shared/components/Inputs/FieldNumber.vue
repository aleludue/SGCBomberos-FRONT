<template>
  <div
    class="error-tooltip-wrapper text-start mb-1"
    :class="{
      'col-12 col-md-6 col-lg-4': !isLoginForm,
      'col-12': isLoginForm,
    }"
  >
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
    </label>

    <input
      :id="uuid"
      v-model="numValue"
      v-bind="$attrs"
      type="number"
      class="form-control tactical-input-number"
      @blur="numBlur"
      :placeholder="placeholdText"
      :class="{ 'is-invalid': numError }"
    />

    <span v-if="numError" class="error-tooltip-msg" role="alert">
      {{ numError }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import { number } from 'yup';

defineOptions({ inheritAttrs: false });

const { t } = useI18n();
const uuid = useId();

const props = defineProps({
  labelText: { type: String, default: '' },
  fieldName: { type: String, default: 'numField' },
  isRequired: { type: Boolean, default: false },
  isLoginForm: { type: Boolean, default: false },
  placeholdText: { type: String, default: 'Ej: 123' },
});

defineModel<number | null>('numVal');

const validShema = computed(() => {
  const detSch = number().typeError(t('Validations.NumType'));
  return props.isRequired
    ? detSch.required().moreThan(0)
    : detSch
        .nullable()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .notRequired();
});

const {
  value: numValue,
  errorMessage: numError,
  handleBlur: numBlur,
} = useField(props.fieldName, validShema, { syncVModel: 'numVal' });
</script>

<style scoped>
.text-secondary-themed {
  color: var(--bs-secondary-color, #94a3b8) !important;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.tactical-input-number {
  padding: 0.75rem 1rem !important;
  font-size: 0.9rem;
  border-radius: 8px !important;
  background-color: #2b3035 !important;
  border: 1px solid #495057 !important;
  color: #f8f9fa !important;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

:global([data-bs-theme='light']) .tactical-input-number,
:global([data-bs-theme='light']) input.tactical-input-number {
  background-color: #f1f5f9 !important;
  border: 1px solid #cbd5e1 !important;
  color: #333a48 !important;
}

.tactical-input-number:focus {
  border-color: #ff6b00 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.2) !important;
}

.tactical-input-number::-webkit-outer-spin-button,
.tactical-input-number::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.tactical-input-number {
  -moz-appearance: textfield;
  appearance: textfield;
}

:global([data-bs-theme='light']) .text-secondary-themed {
  color: var(--bs-secondary-color) !important;
}
</style>
