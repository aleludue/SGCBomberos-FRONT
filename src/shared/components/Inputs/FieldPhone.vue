<template>
  <div class="col-12 col-md-6 col-lg-4 text-start error-tooltip-wrapper mb-1">
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
      <span v-if="isRequired" class="text-danger" aria-hidden="true">*</span>
      <span v-else class="text-muted fw-normal small"> ({{ $t('FormField.OptionalField') }})</span>
    </label>

    <input
      :id="uuid"
      v-model="phoneValue"
      v-bind="$attrs"
      type="tel"
      class="form-control tactical-input-phone"
      :class="{ 'is-invalid': phoneError }"
      @blur="phoneBlur"
      :placeholder="placeholdText || 'Ej: +54 9 3562 ...'"
    />

    <span v-if="phoneError" class="error-tooltip-msg" role="alert">
      {{ phoneError }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, useId } from 'vue';
import { string } from 'yup';
import { regexList } from '@/shared/utils/regexList';

defineOptions({ inheritAttrs: false });

const uuid = useId();

const props = withDefaults(
  defineProps<{
    labelText?: string;
    fieldName?: string;
    isRequired?: boolean;
    placeholdText?: string;
  }>(),
  {
    labelText: '',
    fieldName: 'phoneField',
    isRequired: false,
    placeholdText: '',
  },
);

defineModel<string>('phoneVal');

const phoneSchema = computed(() => {
  let schema = string()
    .transform((value) => (value ? value.replace(/\s|-/g, '') : value))
    .matches(regexList.phone, {
      message: 'Número de teléfono no válido',
      excludeEmptyString: true,
    });

  if (props.isRequired) {
    schema = schema.required();
  }
  return schema;
});

const {
  value: phoneValue,
  errorMessage: phoneError,
  handleBlur: phoneBlur,
} = useField(props.fieldName, phoneSchema, { syncVModel: 'phoneVal' });
</script>

<style scoped>
.tactical-input-phone {
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

.tactical-input-phone:focus {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--brand-primary-rgb), 0.15) !important;
}
</style>
