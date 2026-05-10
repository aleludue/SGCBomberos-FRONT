<template>
  <div v-if="!readonly" class="col-12 col-md-6 col-lg-4 error-tooltip-wrapper">
    <label :for="uuid" class="form-label">
      {{ labelText }}
    </label>

    <select
      :id="uuid"
      v-model="selectedValue"
      v-bind="$attrs"
      class="form-select"
      :class="{ 'is-invalid': selectedError }"
      @blur="selectedBlur"
    >
      <option :value="0" disabled>{{ baseOptionText }}</option>

      <option v-for="opt in optionsList" :key="opt.id" :value="opt.id">
        {{ opt.name }}
      </option>
    </select>

    <span v-if="selectedError" class="error-tooltip-msg" role="alert"> {{ selectedError }}</span>
  </div>

  <FieldReadOnly
    v-else-if="readonly && option !== undefined"
    :label-text="labelText"
    :valueText="currentLabel"
  />
</template>

<script lang="ts" setup>
import { useField } from 'vee-validate';
import { useId, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import FieldReadOnly from './FieldReadOnly.vue';
import { number } from 'yup';

defineOptions({ inheritAttrs: false });

interface SelectOption {
  id: number;
  name: string;
}

const { t } = useI18n();
const uuid = useId();

const props = defineProps({
  labelText: { type: String, default: '' },
  readonly: { type: Boolean, default: false },
  optionsList: { type: Array as () => SelectOption[], default: () => [] },
  fieldName: { type: String, default: 'optionSelect' },
  isRequired: { type: Boolean, default: false },
  baseOptionText: { type: String, default: 'Seleccione una opción...' },
  errorText: { type: String, default: undefined },
});

const optionModel = defineModel<number>('option');

watch(
  () => optionModel.value,
  (newValue) => {
    if (newValue === null || newValue === undefined) {
      optionModel.value = 0;
    }
  },
  { immediate: true },
);

const currentLabel = computed(() => {
  return props.optionsList.find((opt) => opt.id === optionModel.value)?.name ?? '';
});

const selectSchema = computed(() => {
  if (!props.isRequired) return undefined;

  return number()
    .required()
    .min(1, props.errorText || t('ValidationMsg.Required'));
});

const {
  value: selectedValue,
  errorMessage: selectedError,
  handleBlur: selectedBlur,
} = useField(props.fieldName, selectSchema, {
  syncVModel: 'option',
});
</script>
