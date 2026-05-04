<template>
  <div class="col-12 col-md-6 col-lg-4">
    <label for="phInput" class="form-label">
      {{ labelText }}
    </label>
    <input
      v-model="phoneValue"
      type="text"
      class="form-control"
      id="phInput"
      @blur="phoneBlur"
      :class="{ 'border-danger is-invalid': phoneError }"
    />
    <span v-if="phoneError" class="invalid-feedback">{{ phoneError }}</span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { watch } from 'vue';
import { string } from 'yup';

import { regexList } from '@/shared/utils/regexList';

const {
  labelText = undefined,
  phoneVal = undefined,
  fieldName = undefined,
  isRequired = false,
} = defineProps(['labelText', 'phoneVal', 'fieldName', 'isRequired', 'isRequired']);

const phoneSchema = string()
  .transform((value) => (value ? value.replace(/\s|-/g, '') : value))
  .matches(regexList.phone, {
    message: 'Número de teléfono no válido',
    excludeEmptyString: true,
  });

const {
  value: phoneValue,
  errorMessage: phoneError,
  handleBlur: phoneBlur,
} = useField(fieldName || 'phoneInput', isRequired ? phoneSchema.required() : phoneSchema);

watch(
  () => phoneVal,
  (newVal) => {
    if (newVal) phoneValue.value = newVal;
  },
  { immediate: true },
);
</script>
