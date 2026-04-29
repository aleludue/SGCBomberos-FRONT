<template>
  <div :class="classDet" class="col-sm-12 col-xs-12">
    <label for="phInput" class="form-label">
      {{ labelText }}
    </label>
    <input v-model="phoneValue" type="text" class="form-control" id="phInput" @blur="phoneBlur" />
    <span v-if="phoneError" class="text-danger">{{ phoneError }}</span>
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
  classDet = 'col-md-6',
} = defineProps(['labelText', 'phoneVal', 'fieldName', 'isRequired', 'isRequired', 'classDet']);

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
    phoneValue.value = newVal !== undefined ? newVal : '';
  },
  { immediate: true },
);
</script>
