<template>
  <div v-if="!readonly" :class="classBase" class="text-start error-tooltip-wrapper mb-1">
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
    </label>

    <select
      :id="uuid"
      v-model="selectedValue"
      v-bind="$attrs"
      class="form-select tactical-select-input"
      :class="{ 'is-invalid': selectedError }"
      @blur="selectedBlur"
    >
      <option :value="0" disabled>{{ baseOptionText }}</option>
      <option v-for="opt in optionsList" :key="opt.id" :value="opt.id">
        {{ opt.name }}
      </option>
    </select>

    <span v-if="selectedError" class="error-tooltip-msg" role="alert">
      {{ selectedError }}
    </span>
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

const props = withDefaults(
  defineProps<{
    labelText?: string;
    readonly?: boolean;
    optionsList?: SelectOption[];
    fieldName?: string;
    isRequired?: boolean;
    baseOptionText?: string;
    classBase?: string;
  }>(),
  {
    labelText: '',
    readonly: false,
    optionsList: () => [],
    fieldName: 'optionSelect',
    isRequired: false,
    baseOptionText: 'Seleccione una opción...',
    classBase: 'col-12 col-md-6 col-lg-4',
  },
);

const optionModel = defineModel<number>('option');

watch(
  () => optionModel.value,
  (newValue) => {
    if (newValue === null) {
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

  return number().required().min(1, t('Validations.Required'));
});

const {
  value: selectedValue,
  errorMessage: selectedError,
  handleBlur: selectedBlur,
} = useField(props.fieldName, selectSchema, {
  initialValue: optionModel.value,
  syncVModel: 'option',
});
</script>

<style scoped>
.tactical-select-input {
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
  padding-left: 1rem !important;
  font-size: 0.9rem;
  border-radius: 8px !important;
  cursor: pointer;
  background-color: var(--bs-input-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
  color: var(--bs-body-color) !important;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.tactical-select-input:focus {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--brand-primary-rgb), 0.15) !important;
}
</style>
