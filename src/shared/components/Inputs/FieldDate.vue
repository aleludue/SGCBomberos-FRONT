<template>
  <div class="col-12 col-md-6 col-lg-4 error-tooltip-wrapper">
    <label :for="uuid" class="form-label">
      {{ labelText }}
    </label>
    <input
      :id="uuid"
      v-model="formattedDate"
      v-bind="$attrs"
      type="date"
      class="form-control"
      @blur="dateBlur"
      :class="{ 'is-invalid': dateError }"
    />
    <span v-if="dateError" class="error-tooltip-msg"> {{ dateError }}</span>
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
} = useField(props.fieldName, dateSchema, {
  syncVModel: 'dateVal',
});
</script>
