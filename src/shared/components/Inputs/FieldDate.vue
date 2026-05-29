<template>
  <!-- Contenedor responsivo nativo con la estructura unificada del sistema -->
  <div class="col-12 col-md-6 col-lg-4 text-start error-tooltip-wrapper mb-1">
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
    </label>

    <input
      :id="uuid"
      v-model="formattedDate"
      v-bind="$attrs"
      type="date"
      class="form-control tactical-input-date"
      @blur="dateBlur"
      :class="{ 'is-invalid': dateError }"
    />

    <span v-if="dateError" class="error-tooltip-msg" role="alert">
      {{ dateError }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, useId } from 'vue';
import { date } from 'yup';

defineOptions({ inheritAttrs: false });

const uuid = useId();

const props = defineProps({
  labelText: { type: String, default: '' },
  fieldName: { type: String, default: 'dateField' },
  isRequired: { type: Boolean, default: false },
  maxDate: { type: [String, Date], default: undefined },
  minDate: { type: [String, Date], default: undefined },
});

defineModel<string | Date>('dateVal');

const formattedDate = computed({
  get() {
    if (!dateValue.value) return '';
    const d = new Date(dateValue.value as Date);
    return d.toISOString().split('T')[0];
  },
  set(val) {
    dateValue.value = val ? new Date(val) : undefined;
  },
});

const dateSchema = computed(() => {
  let schema = date().typeError('Fecha no válida');
  if (props.isRequired) {
    schema = schema.required();
  }
  if (props.maxDate) {
    schema = schema.max(
      props.maxDate,
      `La fecha debe ser anterior a ${new Date(props.maxDate).toLocaleDateString()}`,
    );
  }
  if (props.minDate) {
    schema = schema.min(
      props.minDate,
      `La fecha debe ser posterior a ${new Date(props.minDate).toLocaleDateString()}`,
    );
  }
  return schema;
});

const {
  value: dateValue,
  errorMessage: dateError,
  handleBlur: dateBlur,
} = useField(props.fieldName, dateSchema, { syncVModel: 'dateVal' });
</script>

<style scoped>
.text-secondary-themed {
  color: var(--bs-secondary-color) !important;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.tactical-input-date {
  padding: 0.75rem 1rem !important;
  font-size: 0.9rem;
  border-radius: 8px !important;
  height: 45px;
  background-color: var(--bs-input-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
  color: var(--bs-body-color) !important;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.tactical-input-date:focus {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--brand-primary-rgb), 0.15) !important;
}

[data-bs-theme='dark'] .tactical-input-date::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(0.9) !important;
  cursor: pointer;
}

[data-bs-theme='light'] .tactical-input-date::-webkit-calendar-picker-indicator {
  filter: invert(0) brightness(0.2) !important;
  cursor: pointer;
}
</style>
