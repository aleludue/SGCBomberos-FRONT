<template>
  <div v-if="!readonly" class="col-sm-12 col-xs-12" :class="classDet || 'col-md-4'">
    <label for="selectField" class="form-label">
      {{ labelText }}
    </label>
    <select class="form-select" id="selectField" v-model="selectedValue" @blur="selectedBlur">
      <option v-for="value in options" :key="value.id" :value="value.id">
        {{ value.name }}
      </option>
    </select>
    <span v-if="selectedError" class="text-danger">{{ selectedError }}</span>
  </div>

  <div
    v-if="readonly && option !== undefined"
    class="col-sm-12 col-xs-12 d-flex flex-wrap align-items-center"
    :class="classDet || 'col-md-4'"
  >
    <p class="m-0 me-2">{{ labelText }}</p>

    <p class="m-0">
      <strong>{{ optionsList.find((g: SelectOption) => g.id === option)?.label }}</strong>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useField } from 'vee-validate';
import { watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const { t } = useI18n();

interface SelectOption {
  id: number;
  name: string;
}

const optionBase: SelectOption = {
  id: 0,
  name: 'Seleccione una opcion...',
};

const options = ref<SelectOption[]>([optionBase]);

const {
  labelText = undefined,
  readonly = false,
  optionsList = [] as SelectOption[],
  errorText = undefined,
  fieldName = undefined,
  option = undefined,
  classDet = undefined,
  isRequired = false,
} = defineProps([
  'labelText',
  'readonly',
  'optionsList',
  'errorText',
  'fieldName',
  'option',
  'classDet',
  'isRequired',
]);

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
  () => option,
  (newVal) => {
    selectedValue.value = newVal !== undefined ? newVal : optionBase.id;
  },
  { immediate: true },
);
</script>
