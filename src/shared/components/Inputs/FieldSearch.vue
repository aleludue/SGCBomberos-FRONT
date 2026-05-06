<template>
  <div class="col-12 col-md-6 col-lg-4 position-relative error-tooltip-wrapper">
    <label :for="uuid" class="form-label">{{ labelText }}</label>
    <div class="input-group">
      <input
        :id="uuid"
        v-model="searchValue"
        v-bind="$attrs"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': searchError }"
        @blur="onInputBlur"
      />
      <span v-if="isLoading" class="input-group-text">
        <div class="spinner-border spinner-border-sm text-secondary"></div>
      </span>
    </div>
    <span v-if="searchError" class="error-tooltip-msg">{{ searchError }}</span>

    <!-- RESULTADOS -->
    <div
      v-if="resultList.length > 0"
      class="list-group mt-1 position-absolute w-100 pe-4"
      style="z-index: 1050"
    >
      <button
        v-for="option in resultList"
        :key="option.id"
        type="button"
        class="list-group-item list-group-item-action"
        @mousedown="selectOption(option)"
      >
        {{ option.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue';
import { string } from 'yup';

defineOptions({ inheritAttrs: false });

const uuid = useId();
const isMounted = ref(false);
const isInternalChange = ref(false);
let blurTimeout: any = null;
let internalTimeout: any = null;

const props = defineProps({
  labelText: { type: String, default: '' },
  fieldName: { type: String, default: 'searchField' },
  isRequired: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
});

defineModel<string>('textDetail', { default: '' });
const idSelected = defineModel<number>('idSelected', { default: 0 });
const resultList = defineModel<any[]>('resultList', { default: [] });
const lastSelected = defineModel<string>('lastSelected', { default: '' });

const {
  value: searchValue,
  errorMessage: searchError,
  handleBlur,
  validate,
} = useField(
  props.fieldName,
  computed(() =>
    props.isRequired
      ? string()
          .required('Campo obligatorio')
          .test('is-sel', 'Selecciona de la lista', () => Number(idSelected.value) > 0)
      : string(),
  ),
  { syncVModel: 'textDetail', validateOnMount: false },
);

const onInputBlur = (e: any) => {
  handleBlur(e);
  setTimeout(() => {
    if (!isInternalChange.value) {
      resultList.value = [];
    }
  }, 200);
};

const selectOption = async (option: any) => {
  isInternalChange.value = true;

  idSelected.value = option.id;
  lastSelected.value = option.name;
  searchValue.value = option.name;

  resultList.value = [];

  await nextTick();
  await validate();

  setTimeout(() => {
    isInternalChange.value = false;
  }, 300);
};

watch(searchValue, () => {
  if (!isMounted.value || isInternalChange.value) return;
  idSelected.value = 0;
});

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true;
  }, 200);
});

onUnmounted(() => {
  clearTimeout(blurTimeout);
  clearTimeout(internalTimeout);
});
</script>
