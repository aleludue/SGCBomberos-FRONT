<template>
  <div
    class="modal fade"
    id="validActionModal"
    tabindex="-1"
    aria-hidden="true"
    aria-labelledby="modalTitle"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="modalTitle" class="modal-title fs-5">{{ titleText }}</h1>
          <button
            id="closeValidActionModal"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <p class="text-justify m-0">{{ bodyText }}</p>
        </div>

        <div class="modal-footer d-flex justify-content-center">
          <button type="button" class="btn btn-success" @click="confirmAction">
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
  titleText: { type: String, default: 'Confirmar Acción' },
  bodyText: { type: String, default: '¿Está seguro de que desea realizar esta acción?' },
});

const emit = defineEmits<{
  confirm: [];
}>();

const confirmAction = () => {
  emit('confirm');
};
</script>
