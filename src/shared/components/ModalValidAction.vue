<template>
  <div
    class="modal fade"
    id="validActionModal"
    tabindex="-1"
    aria-hidden="true"
    aria-labelledby="modalTitle"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div
        class="modal-content border border-secondary-subtle shadow-lg bg-body-tertiary custom-modal-tactical"
      >
        <div class="modal-header border-bottom border-secondary-subtle py-3 px-4">
          <h1
            id="modalTitle"
            class="modal-title fs-5 fw-bold text-body d-flex align-items-center gap-2"
          >
            <i class="bi bi-exclamation-triangle text-orange-fire"></i>
            {{ titleText }}
          </h1>
          <button
            id="closeValidActionModal"
            type="button"
            class="btn-close btn-close-themed"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body py-4 px-4">
          <p class="m-0 text-secondary-themed fw-medium">{{ bodyText }}</p>
        </div>

        <div
          class="modal-footer border-top border-secondary-subtle py-3 px-4 d-flex justify-content-end gap-2"
        >
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary px-3"
            data-bs-dismiss="modal"
          >
            {{ $t('GenericBtn.BtnClose') || 'Cerrar' }}
          </button>

          <button
            type="button"
            class="btn btn-sm btn-orange-submit px-4 fw-bold shadow-sm"
            @click="confirmAction"
          >
            <i class="bi bi-check-circle me-1"></i>
            {{ $t('GenericBtn.BtnConfirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  titleText: {
    type: String,
    default: 'Confirmar Acción',
  },
  bodyText: {
    type: String,
    default: '¿Está seguro de que desea realizar esta acción?',
  },
});

const emit = defineEmits<{
  confirm: [];
}>();

const confirmAction = () => {
  emit('confirm');
  const closeBtn = document.getElementById('closeValidActionModal');
  if (closeBtn) closeBtn.click();
};
</script>

<style scoped>
.custom-modal-tactical {
  border-radius: 14px !important;
  overflow: hidden;
}

.text-secondary-themed {
  color: var(--bs-secondary-color) !important;
  line-height: 1.5;
  font-size: 0.95rem;
}

[data-bs-theme='dark'] .btn-close-themed {
  filter: invert(1) brightness(1);
}

.btn-outline-secondary {
  border-color: var(--bs-border-color) !important;
  color: var(--bs-secondary-color) !important;
  transition: all 0.2s ease;
}

.btn-outline-secondary:hover {
  background-color: var(--bs-tertiary-bg) !important;
  color: var(--bs-body-color) !important;
}

.modal.show .custom-modal-tactical {
  animation: modalScaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalScaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
