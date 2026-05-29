<template>
  <div class="col-12 col-md-6 col-lg-4 text-start mb-1">
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
    </label>

    <div class="position-relative tactical-search-container">
      <input
        :id="uuid"
        v-model="searchValue"
        v-bind="$attrs"
        type="text"
        class="form-control tactical-input-search"
        :class="{
          'pe-5': isLoading,
        }"
        @input="handleInput"
        placeholder="..."
      />

      <div
        v-if="isLoading"
        class="spinner-wrapper-inner d-flex align-items-center justify-content-center"
      >
        <div class="spinner-grow spinner-grow-sm text-orange-fire" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, useId, onUnmounted } from 'vue';

defineOptions({ inheritAttrs: false });

const uuid = useId();
const isLoading = ref(false);
let timeout: ReturnType<typeof setTimeout> | null = null;

const props = defineProps({
  labelText: { type: String, default: '' },
  delay: { type: Number, default: 1500 },
});

const searchValue = defineModel<string>();
const emit = defineEmits(['applySearch']);

const handleInput = () => {
  isLoading.value = true;
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('applySearch', searchValue.value);
    isLoading.value = false;
  }, props.delay);
};

onUnmounted(() => {
  if (timeout) clearTimeout(timeout);
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

:global([data-bs-theme='light']) .tactical-input-search,
:global([data-bs-theme='light']) input.tactical-input-search,
[data-bs-theme='light'] .tactical-input-search {
  background-color: var(--bs-input-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
  color: var(--bs-body-color) !important;
}

.tactical-input-search:focus {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--brand-primary-rgb), 0.15) !important;
}

.spinner-wrapper-inner {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  z-index: 5;
  pointer-events: none;
}

:global([data-bs-theme='light']) .text-secondary-themed {
  color: var(--bs-secondary-color) !important;
}
</style>
