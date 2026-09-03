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
      <span v-if="isRequired" class="text-danger" aria-hidden="true">*</span>
      <span v-else class="text-muted fw-normal small"> ({{ t('FormField.OptionalField') }})</span>
    </label>

    <textarea
      v-if="isTextarea"
      :id="uuid"
      v-model="textValue"
      v-bind="$attrs"
      class="form-control tactical-input-text"
      :class="{
        'is-invalid': textError,
        'text-uppercase': isAlfaOblig,
      }"
      :placeholder="placeholdText"
      @blur="textBlur"
    />

    <input
      v-else
      :id="uuid"
      v-model="textValue"
      v-bind="$attrs"
      type="text"
      class="form-control tactical-input-text"
      :class="{
        'is-invalid': textError,
        'text-uppercase': isAlfaOblig,
      }"
      :placeholder="placeholdText"
      @blur="textBlur"
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

const props = withDefaults(
  defineProps<{
    labelText?: string;
    fieldName?: string;
    isRequired?: boolean;
    maxLength?: number;
    minLength?: number;
    length?: number;
    isLoginForm?: boolean;
    placeholdText?: string;
    isAlfaOblig?: boolean;
    isTextarea?: boolean;
    onlyNumber?: boolean;
  }>(),
  {
    labelText: '',
    fieldName: 'textField',
    isRequired: false,
    maxLength: 0,
    minLength: 0,
    length: 0,
    isLoginForm: false,
    placeholdText: '...',
    isAlfaOblig: false,
    isTextarea: false,
    onlyNumber: false,
  },
);

defineModel<string>('textDet');

const validSchema = computed(() => {
  let schema = string().nullable();

  if (props.isRequired) {
    schema = schema.required(t('Validations.Required'));
  } else {
    schema = schema.notRequired();
  }

  if (props.maxLength)
    schema = schema.max(props.maxLength, t('Validations.MaxLength', { max: props.maxLength }));

  if (props.minLength && props.isRequired)
    schema = schema.min(props.minLength, t('Validations.MinLength', { min: props.minLength }));

  if (props.length) schema = schema.length(props.length);

  if (props.isAlfaOblig)
    schema = schema.matches(/^[a-zA-Z0-9]+$/, t('Validations.MatchAlphanumeric'));

  if (props.onlyNumber) schema = schema.matches(/^[0-9]+$/, t('Validations.NumType'));

  return schema;
});

const {
  value: textValue,
  errorMessage: textError,
  handleBlur: textBlur,
  resetField: resetTextField,
} = useField<string>(props.fieldName, validSchema, { syncVModel: 'textDet' });

defineExpose({
  resetTextField,
});
</script>

<style scoped>
.tactical-input-text {
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

.tactical-input-text:focus {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--brand-primary-rgb), 0.2) !important;
}

textarea.tactical-input-text {
  min-height: 100px;
  resize: vertical;
}
</style>
