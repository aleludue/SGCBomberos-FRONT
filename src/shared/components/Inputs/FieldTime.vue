<template>
  <div
    class="text-start error-tooltip-wrapper mb-1"
    :class="{
      'col-12 col-md-6 col-lg-4': responsive,
      'col-12': !responsive,
    }"
  >
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
      <span v-if="isRequired" class="text-danger" aria-hidden="true">*</span>
      <span v-else class="text-muted fw-normal small"> ({{ $t('FormField.OptionalField') }})</span>
    </label>

    <input
      :id="uuid"
      v-model="timeValue"
      v-bind="$attrs"
      type="time"
      :max="maxTime"
      :min="minTime"
      class="form-control tactical-input-date"
      @blur="timeBlur"
      :class="{ 'is-invalid': timeError }"
    />

    <span v-if="timeError" class="error-tooltip-msg" role="alert">
      {{ timeError }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, useId } from 'vue';
import { string } from 'yup';

defineOptions({ inheritAttrs: false });

const uuid = useId();

const props = withDefaults(
  defineProps<{
    labelText?: string;
    fieldName?: string;
    isRequired?: boolean;
    maxTime?: string;
    minTime?: string;
    responsive?: boolean;
  }>(),
  {
    labelText: '',
    fieldName: 'timeField',
    isRequired: false,
    maxTime: undefined,
    minTime: undefined,
    responsive: true,
  },
);

defineModel<string | null>('timeVal');

const timeSchema = computed(() => {
  let schema = string().nullable().typeError('Hora no válida');

  if (props.isRequired) {
    schema = schema.required('Este campo es obligatorio');
  }

  schema = schema.matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora no válido');

  if (props.maxTime) {
    schema = schema.test('maxTime', `La hora debe ser anterior a ${props.maxTime}`, (value) => {
      if (!value) return true;
      return value <= props.maxTime!;
    });
  }

  if (props.minTime) {
    schema = schema.test('minTime', `La hora debe ser posterior a ${props.minTime}`, (value) => {
      if (!value) return true;
      return value >= props.minTime!;
    });
  }

  return schema;
});

const {
  value: timeValue,
  errorMessage: timeError,
  handleBlur: timeBlur,
} = useField(props.fieldName, timeSchema, { syncVModel: 'timeVal' });
</script>
