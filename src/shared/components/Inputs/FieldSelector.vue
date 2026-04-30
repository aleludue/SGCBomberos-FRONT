<template>
  <div v-if="!readonly" class="col-12 col-md-6 col-lg-4">
    <label for="selectField" class="form-label">
      {{ labelText }}
    </label>
    <select class="form-select" id="selectField" v-model="option" @blur="selectedBlur">
      <option v-for="value in options" :key="value.id" :value="value.id">
        {{ value.name }}
      </option>
    </select>
    <span v-if="selectedError" class="text-danger">{{ selectedError }}</span>
  </div>

  <FieldReadOnly
    v-if="readonly && option !== undefined"
    :label-text="labelText"
    :valueText="optionsList.find((g: SelectOption) => g.id === option)?.name"
  />
</template>

<script lang="ts" setup>
import { useField } from 'vee-validate';
import { watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import FieldReadOnly from './FieldReadOnly.vue';

const { t } = useI18n();

interface SelectOption {
  id: number;
  name: string;
}

const {
  labelText = undefined,
  readonly = false,
  optionsList = [] as SelectOption[],
  errorText = undefined,
  fieldName = undefined,
  isRequired = false,
  baseOptionText = 'Seleccione una opcion...',
} = defineProps([
  'labelText',
  'readonly',
  'optionsList',
  'errorText',
  'fieldName',
  'isRequired',
  'baseOptionText',
]);

const option = defineModel('option', { default: undefined });

const optionBase: SelectOption = {
  id: 0,
  name: baseOptionText,
};

const options = ref<SelectOption[]>([optionBase]);

const {
  value: selectedValue,
  errorMessage: selectedError,
  handleBlur: selectedBlur,
} = useField(
  fieldName || 'optionSelect',
  isRequired
    ? yup
        .number()
        .required()
        .min(1, errorText || t('ValidationMsg.Required'))
    : undefined,
);

watch(
  () => optionsList,
  (newVal) => {
    options.value = [optionBase, ...newVal];
  },
  { immediate: true },
);

watch(
  () => option.value,
  (newVal) => {
    selectedValue.value = newVal !== undefined ? newVal : optionBase.id;
  },
  { immediate: true },
);
</script>
