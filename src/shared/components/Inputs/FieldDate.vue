<template>
  <div class="col-12 col-md-6 col-lg-4">
    <label for="dateInput" class="form-label">
      {{ labelText }}
    </label>
    <input v-model="dateValue" type="date" class="form-control" id="dateInput" @blur="dateBlur" />
    <span v-if="dateError" class="text-danger">{{ dateError }}</span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { watch } from 'vue';
import { date } from 'yup';

const {
  labelText = undefined,
  dateVal = undefined,
  fieldName = undefined,
  isRequired = false,
  maxDate = undefined,
  minDate = undefined,
} = defineProps(['labelText', 'dateVal', 'fieldName', 'isRequired', 'maxDate', 'minDate']);

let dateSchema = date().typeError('Fecha no válida');

if (maxDate) {
  dateSchema = dateSchema.max(
    maxDate,
    `La fecha debe ser anterior a ${new Date(maxDate).toLocaleDateString()}`,
  );
}

if (minDate) {
  dateSchema = dateSchema.min(
    minDate,
    `La fecha debe ser posterior a ${new Date(minDate).toLocaleDateString()}`,
  );
}

const finalSchema = isRequired ? dateSchema.required() : dateSchema;

const {
  value: dateValue,
  errorMessage: dateError,
  handleBlur: dateBlur,
} = useField(fieldName || 'dateInput', finalSchema);

watch(
  () => dateVal,
  (newVal) => {
    dateValue.value =
      newVal !== undefined ? new Date(newVal).toISOString().split('T')[0] : undefined;
  },
  { immediate: true },
);
</script>
