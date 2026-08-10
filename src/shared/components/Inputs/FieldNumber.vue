<template>
  <div
    :class="[classBase, { 'col-md-6 col-lg-4': !isLoginForm }]"
    class="error-tooltip-wrapper text-start mb-1"
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

const props = withDefaults(
  defineProps<{
    labelText?: string;
    fieldName?: string;
    isRequired?: boolean;
    isLoginForm?: boolean;
    placeholdText?: string;
    classBase?: string;
    maxValue?: number;
  }>(),
  {
    labelText: '',
    fieldName: 'numField',
    isRequired: false,
    isLoginForm: false,
    placeholdText: 'Ej: 123',
    classBase: 'col-12',
    maxValue: 0,
  },
);

defineModel<number | null>('numVal');

const validShema = computed(() => {
  let detSch = number().typeError(t('Validations.NumType'));

  if (props.maxValue) {
    detSch = detSch.max(props.maxValue);
  }

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
  color: var(--bs-secondary-color) !important;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.tactical-input-number {
  padding: 0.75rem 1rem !important;
  font-size: 0.9rem;
  border-radius: 8px !important;
  background-color: var(--bs-input-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
  color: var(--bs-body-color) !important;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.tactical-input-number:focus {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--brand-primary-rgb), 0.2) !important;
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
</style>
