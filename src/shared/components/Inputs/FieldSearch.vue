<template>
  <div class="col-12 col-md-6 col-lg-4 position-relative error-tooltip-wrapper">
    <label for="searField" class="form-label"> {{ labelText }} </label>
    <div class="input-group">
      <input
        id="searField"
        type="text"
        class="form-control"
        v-model="textDetail"
        :placeholder="placeholder"
        @blur="searchBlur"
        :class="{ 'is-invalid': searchError }"
      />
      <span v-if="isLoading" class="input-group-text">⏳</span>
    </div>

    <span v-if="searchError" class="error-tooltip-msg"> {{ searchError }}</span>

    <div
      v-if="resultList.length > 0"
      class="list-group mt-1 position-absolute w-100 pe-3"
      style="z-index: 1000"
    >
      <button
        v-for="option in resultList"
        :key="option.id"
        type="button"
        class="list-group-item list-group-item-action"
        @click="selectOption(option)"
      >
        {{ option.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import { string } from 'yup';

interface OptionsDetail {
  id: number;
  name: string;
}

const {
  labelText = undefined,
  fieldName = undefined,
  placeholder = 'Escribe 5 caracteres para buscar...',
  isRequired = false,
} = defineProps(['labelText', 'fieldName', 'placeholder', 'isRequired']);

const textDetail = defineModel<string>('textDetail', { default: '' });
const idSelected = defineModel<number>('idSelected', { default: 0 });
const resultList = defineModel<OptionsDetail[]>('resultList', { default: [] });
const lastSelected = defineModel<string>('lastSelected', { default: '' });

const isLoading = ref(false);
const ignoreTextWatcher = ref(false);

const searchSchema = computed(() => {
  if (!isRequired) return undefined;

  return string().test('required-or-selected', 'Este campo es obligatorio.', (value) => {
    return idSelected.value > 0 && value?.trim() !== '';
  });
});

const {
  value: searchValue,
  errorMessage: searchError,
  handleBlur: searchBlur,
} = useField(fieldName || 'searchField', searchSchema);

const selectOption = async (option: OptionsDetail) => {
  ignoreTextWatcher.value = true;
  textDetail.value = option.name;
  lastSelected.value = option.name;
  resultList.value = [];
  idSelected.value = option.id;
};

watch(
  () => textDetail.value,
  (newVal) => {
    searchValue.value = newVal;
    if (ignoreTextWatcher.value) {
      ignoreTextWatcher.value = false;
      return;
    }

    idSelected.value = 0;
  },
  { immediate: true },
);
</script>
