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
      v-model="textValue"
      v-bind="$attrs"
      type="text"
      class="form-control tactical-input-text"
      :class="{
        'is-invalid': textError,
        'text-uppercase': isAlfaOblig,
      }"
      @blur="textBlur"
      :placeholder="placeholdText"
    />

    <span v-if="textError" class="error-tooltip-msg" role="alert">
      {{ textError }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import { string } from 'yup';

defineOptions({ inheritAttrs: false });

const { t } = useI18n();
const uuid = useId();

const props = defineProps({
  labelText: { type: String, default: '' },
  fieldName: { type: String, default: 'textField' },
  isRequired: { type: Boolean, default: false },
  maxLength: { type: Number, default: 0 },
  minLength: { type: Number, default: 0 },
  length: { type: Number, default: 0 },
  isLoginForm: { type: Boolean, default: false },
  placeholdText: { type: String, default: '' },
  isAlfaOblig: { type: Boolean, default: false },
});

defineModel<string>('textDet');

const validSchema = computed(() => {
  let schema = string();
  if (props.isRequired) schema = schema.required(t('Validations.Required'));

  if (props.maxLength)
    schema = schema.max(props.maxLength, t('Validations.MaxLength', { max: props.maxLength }));

  if (props.minLength)
    schema = schema.min(props.minLength, t('Validations.MinLength', { min: props.minLength }));

  if (props.length) schema = schema.length(props.length);

  if (props.isAlfaOblig)
    schema = schema.matches(/^[a-zA-Z0-9]+$/, t('Validations.MatchAlphanumeric'));

  return schema;
});

const {
  value: textValue,
  errorMessage: textError,
  handleBlur: textBlur,
  resetField: resetTextField,
} = useField(props.fieldName, validSchema, { syncVModel: 'textDet' });

defineExpose({
  resetTextField,
});
</script>

<style scoped>
.text-secondary-themed {
  color: var(--bs-secondary-color, #94a3b8) !important;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.tactical-input-text {
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

:global([data-bs-theme='light']) .tactical-input-text,
:global([data-bs-theme='light']) input.tactical-input-text {
  background-color: #f1f5f9 !important;
  border: 1px solid #cbd5e1 !important;
  color: #333a48 !important;
}

.tactical-input-text:focus {
  border-color: #ff6b00 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.2) !important;
}

:global([data-bs-theme='light']) .text-secondary-themed {
  color: var(--bs-secondary-color) !important;
}
</style>
