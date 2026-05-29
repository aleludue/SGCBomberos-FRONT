<template>
  <div class="col-12 col-md-6 col-lg-4 text-start position-relative error-tooltip-wrapper mb-1">
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
    </label>

    <div class="position-relative tactical-search-input-wrapper">
      <input
        :id="uuid"
        v-model="searchValue"
        v-bind="$attrs"
        type="text"
        class="form-control tactical-input-search"
        :class="{ 'is-invalid': searchError, 'pe-5': isLoading }"
        @blur="onInputBlur"
        autocomplete="off"
        placeholder="..."
      />

      <div
        v-if="isLoading"
        class="spinner-search-inner d-flex align-items-center justify-content-center"
      >
        <div class="spinner-border spinner-border-sm text-orange-fire" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
    </div>

    <span v-if="searchError" class="error-tooltip-msg" role="alert">
      {{ searchError }}
    </span>

    <div
      v-if="resultList.length > 0"
      class="list-group position-absolute w-100 tactical-results-dropdown shadow-lg mt-1"
    >
      <button
        v-for="option in resultList"
        :key="option.id"
        type="button"
        class="list-group-item list-group-item-action py-2 px-3 fw-medium text-start border-0 text-themed-item"
        @mousedown="selectOption(option)"
      >
        <i class="bi bi-geo-alt-fill me-2 small text-orange-fire"></i>
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

let blurTimeout: ReturnType<typeof setTimeout> | null = null;
let internalTimeout: ReturnType<typeof setTimeout> | null = null;

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
  blurTimeout = setTimeout(() => {
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

  internalTimeout = setTimeout(() => {
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
  if (blurTimeout) clearTimeout(blurTimeout);
  if (internalTimeout) clearTimeout(internalTimeout);
});
</script>

<style scoped>
.text-secondary-themed {
  color: var(--bs-secondary-color) !important;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.tactical-input-search {
  padding: 0.75rem 1rem !important;
  font-size: 0.9rem;
  border-radius: 8px !important;
  width: 100%;
  background-color: var(--bs-input-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
  color: var(--bs-body-color) !important;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.tactical-input-search:focus {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--brand-primary-rgb), 0.15) !important;
}

.text-orange-fire {
  color: var(--brand-primary) !important;
}

.spinner-search-inner {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  z-index: 5;
  pointer-events: none;
}

.tactical-results-dropdown {
  z-index: 1050;
  border-radius: 8px !important;
  overflow: hidden;
  border: 1px solid var(--bs-border-color) !important;
  background-color: var(--bs-body-bg) !important;
  max-height: 220px;
  overflow-y: auto;
}

.text-themed-item {
  background-color: var(--bs-body-bg) !important;
  color: var(--bs-body-color) !important;
  font-size: 0.875rem;
  transition: all 0.15s ease;
}

.text-themed-item:hover {
  background-color: rgba(var(--brand-primary-rgb), 0.12) !important;
  color: var(--brand-primary) !important;
  padding-left: 1.25rem !important;
}
</style>
