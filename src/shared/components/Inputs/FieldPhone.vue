<template>
  <div class="col-12 col-md-6 col-lg-4 text-start error-tooltip-wrapper mb-1">
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
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

const props = defineProps({
  labelText: { type: String, default: '' },
  fieldName: { type: String, default: 'phoneField' },
  isRequired: { type: Boolean, default: false },
  placeholdText: { type: String, default: '' },
});

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
.text-secondary-themed {
  color: var(--bs-secondary-color) !important;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

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
