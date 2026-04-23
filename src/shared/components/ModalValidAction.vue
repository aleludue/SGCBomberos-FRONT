<template>
  <div class="modal fade" id="validActionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">{{ titleText }}</h1>
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
            <i class="bi bi-check-circle"></i>
            {{ $t('GenericBtn.BtnConfirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  titleText = 'Confirmar Acción',
  bodyText = '¿Está seguro de que desea realizar esta acción?',
} = defineProps(['titleText', 'bodyText']);

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();

const confirmAction = () => {
  emit('confirm');
};
</script>
