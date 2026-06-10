<template>
  <div class="col-12 col-md-6 col-lg-4 text-start error-tooltip-wrapper mb-1">
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
    </label>

    <input
      :id="uuid"
      v-model="formattedDate"
      v-bind="$attrs"
      type="date"
      :max="maxDateString"
      :min="minDateString"
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
import { isoToLocalDate, localDateToIso } from '@/shared/utils/genericFuntions';
import { useField } from 'vee-validate';
import { computed, useId } from 'vue';
import { date } from 'yup';

defineOptions({ inheritAttrs: false });

const uuid = useId();

const props = withDefaults(
  defineProps<{
    labelText?: string;
    fieldName?: string;
    isRequired?: boolean;
    maxDate?: string | Date;
    minDate?: string | Date;
  }>(),
  {
    labelText: '',
    fieldName: 'dateField',
    isRequired: false,
    maxDate: undefined,
    minDate: undefined,
  },
);

defineModel<string | Date | null>('dateVal');

const minDateString = computed(() => {
  if (!props.minDate) return undefined;
  const localStr = isoToLocalDate(props.minDate as string | Date);
  return localDateToIso(localStr);
});

const maxDateString = computed(() => {
  if (!props.maxDate) return undefined;
  const localStr = isoToLocalDate(props.maxDate as string | Date);
  return localDateToIso(localStr);
});

const formattedDate = computed({
  get() {
    if (!dateValue.value) return '';
    const localStr = isoToLocalDate(dateValue.value as string | Date);
    return localDateToIso(localStr);
  },
  set(val) {
    if (!val) {
      dateValue.value = null;
      return;
    }
    const [year, month, day] = val.split('-').map(Number);
    dateValue.value = new Date(year, month - 1, day);
  },
});

const dateSchema = computed(() => {
  let schema = date().nullable().typeError('Fecha no válida');

  if (props.isRequired) {
    schema = schema.required('Este campo es obligatorio');
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

/* Mejora UX: Muestra el cursor de selección en todo el input */
.tactical-input-date::-webkit-calendar-picker-indicator {
  cursor: pointer;
  padding: 5px;
}

[data-bs-theme='dark'] .tactical-input-date::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(0.9) !important;
}

[data-bs-theme='light'] .tactical-input-date::-webkit-calendar-picker-indicator {
  filter: invert(0) brightness(0.2) !important;
}
</style>
