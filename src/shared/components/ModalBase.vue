<template>
  <div
    class="modal fade"
    :id="modalName"
    ref="modalRef"
    tabindex="-1"
    aria-hidden="true"
    :aria-labelledby="titleId"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div
        class="modal-content border border-secondary-subtle shadow-lg bg-body-tertiary custom-modal-tactical"
      >
        <div class="modal-header border-bottom border-secondary-subtle py-3 px-4">
          <h1
            :id="titleId"
            class="modal-title fs-5 fw-bold text-body d-flex align-items-center gap-2"
          >
            <i class="bi text-orange-fire" :class="[titleIcon]"></i>
            {{ titleText }}
          </h1>
          <button
            :id="closeId"
            type="button"
            class="btn-close btn-close-themed"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body py-4 px-4">
          <slot></slot>
        </div>

        <div class="modal-footer px-4 justify-content-end">
          <BtnConfirm
            :type="btnType"
            :form="formName"
            icon="bi-check-circle"
            :text-detail="btnText ?? $t('Buttons.Confirm')"
            @click="confirmActionModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Modal } from 'bootstrap';

import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';

const props = withDefaults(
  defineProps<{
    titleText: string;
    titleIcon?: string;
    modalName?: string;
    formName?: string;
    btnType?: 'button' | 'submit';
    btnText?: string;
  }>(),
  {
    titleIcon: 'bi-exclamation-triangle',
    modalName: 'baseModal',
    btnType: 'button',
  },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const closeId = 'close' + props.modalName;
const titleId = props.modalName + 'Title';
const modalRef = ref<HTMLElement | null>(null);
let bootstrapModal: Modal | null = null;
let isConfirming = false;

const open = () => {
  bootstrapModal!.show();
};

const close = () => {
  bootstrapModal!.hide();
};

defineExpose({
  open,
  close,
  modalElement: modalRef,
});

const handleModalClose = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  if (isConfirming) {
    isConfirming = false;
    return;
  }

  emit('cancel');
};

const confirmActionModal = () => {
  if (props.btnType == 'button') isConfirming = true;
  emit('confirm');
};

onMounted(() => {
  if (modalRef.value) {
    bootstrapModal = new Modal(modalRef.value);
    modalRef.value.addEventListener('hide.bs.modal', handleModalClose);
  }
});

onBeforeUnmount(() => {
  if (modalRef.value) {
    modalRef.value.removeEventListener('hide.bs.modal', handleModalClose);
  }
  bootstrapModal!.dispose();
});
</script>

<style scoped>
.custom-modal-tactical {
  border-radius: 14px !important;
  overflow: hidden;
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
