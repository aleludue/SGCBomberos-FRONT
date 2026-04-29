<template>
  <div :class="classDet" class="col-sm-12 col-xs-12">
    <label for="numbInput" class="form-label">
      {{ labelText }}
    </label>
    <input v-model="numValue" type="number" class="form-control" id="numbInput" @blur="numBlur" />
    <span v-if="numError" class="text-danger">{{ numError }}</span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { watch } from 'vue';
import { number } from 'yup';

const {
  labelText = undefined,
  numVal = undefined,
  fieldName = undefined,
  isRequired = false,
  classDet = 'col-md-6',
} = defineProps(['labelText', 'numVal', 'fieldName', 'isRequired', 'classDet']);

const {
  value: numValue,
  errorMessage: numError,
  handleBlur: numBlur,
} = useField(fieldName || 'numInput', isRequired ? number().moreThan(0) : number());

watch(
  () => numVal,
  (newVal) => {
    numValue.value = newVal !== undefined ? newVal : 0;
  },
  { immediate: true },
);
</script>
