<template>
  <div
    class="text-start error-tooltip-wrapper mb-1"
    :class="{
      'col-12 col-md-6 col-lg-4': !isLoginForm,
      'col-12': isLoginForm,
    }"
  >
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
      <span v-if="isRequired" class="text-danger" aria-hidden="true">*</span>
      <span v-else class="text-muted fw-normal small"> ({{ $t('FormField.OptionalField') }})</span>
    </label>

    <input
      :id="uuid"
      v-model="emailValue"
      v-bind="$attrs"
      type="text"
      class="form-control tactical-input-email"
      autocomplete="off"
      :placeholder="placeholdText || 'ejemplo@correo.com'"
      @blur="emailBlur"
      :class="{ 'is-invalid': emailError }"
    />

    <span v-if="emailError" class="error-tooltip-msg" role="alert">
      {{ emailError }}
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
    placeholdText?: string;
    isLoginForm?: boolean;
    isRequired?: boolean;
  }>(),
  {
    labelText: '',
    fieldName: 'emailField',
    placeholdText: 'your@example.ar',
    isLoginForm: true,
    isRequired: false,
  },
);

defineModel<string>('email');

const emailSchema = computed(() => {
  let schema = string().nullable().email();

  if (props.isRequired) {
    schema = schema.required(t('Validations.Required'));
  } else {
    schema = schema.notRequired();
  }

  return schema;
});

const {
  value: emailValue,
  errorMessage: emailError,
  handleBlur: emailBlur,
  resetField: resetEmailField,
} = useField(props.fieldName, emailSchema, { syncVModel: 'email' });

defineExpose({
  resetEmailField,
});
</script>

<style scoped>
.tactical-input-email {
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

.tactical-input-email:focus {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--brand-primary-rgb), 0.2) !important;
}
</style>
