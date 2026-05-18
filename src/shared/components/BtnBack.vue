<template>
  <div class="d-flex mt-3 mb-0 w-100 btn-back-responsive-wrapper">
    <button
      type="button"
      class="btn btn-sm btn-back-custom px-3 py-2 fw-semibold shadow-sm d-inline-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto"
      @click="navigateBack"
    >
      <i class="bi bi-arrow-left transition-transform"></i>
      <span>{{ $t('Buttons.Back') }}</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  toHome: {
    type: Boolean,
    default: false,
  },
});

const navigateBack = () => {
  if (props.toHome) {
    router.push({ name: 'home' });
  } else {
    router.back();
  }
};
</script>

<style scoped>
.btn-back-responsive-wrapper {
  justify-content: center !important;
  width: 100%;
}

.btn-back-custom {
  background-color: var(--bs-tertiary-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
  color: var(--bs-body-color) !important;
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 40px;
  max-width: 165px;
}

.transition-transform {
  transition: transform 0.2s ease;
}

.btn-back-custom:hover {
  background-color: var(--bs-border-color) !important;
  border-color: var(--bs-secondary-color) !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08) !important;
}

.btn-back-custom:hover .transition-transform {
  transform: translateX(-3px);
}

.btn-back-custom:focus-visible {
  outline: none;
  border-color: var(--bs-secondary-color) !important;
  box-shadow: 0 0 0 0.25rem rgba(100, 116, 139, 0.2) !important;
}

@media (max-width: 575.98px) {
  .btn-back-custom {
    max-width: 100% !important;
  }
  .btn-back-responsive-wrapper {
    padding: 0 4px;
    margin-bottom: 1rem;
  }
}

[data-bs-theme='dark'] .btn-back-custom:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}
</style>
