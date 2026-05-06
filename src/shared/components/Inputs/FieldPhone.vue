<template>
  <div class="col-12 col-md-6 col-lg-4 error-tooltip-wrapper">
    <label :for="uuid" class="form-label">
      {{ labelText }}
    </label>
    <input
      :id="uuid"
      v-model="phoneValue"
      v-bind="$attrs"
      type="tel"
      class="form-control"
      :class="{ 'is-invalid': phoneError }"
      @blur="phoneBlur"
      :placeholder="placeholdText"
    />
    <span v-if="phoneError" class="error-tooltip-msg"> {{ phoneError }}</span>
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
} = useField(props.fieldName, phoneSchema, {
  syncVModel: 'phoneVal',
});
</script>
