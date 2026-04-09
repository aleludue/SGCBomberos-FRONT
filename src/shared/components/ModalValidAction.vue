<template>
  <div class="modal fade" id="validActionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">{{ props.TitleText }}</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ props.BodyText }}</p>
        </div>
        <div class="modal-footer">
          <button
            id="closeModalRole"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            {{ $t('GenericBtn.BtnClose') }}
          </button>
          <button type="button" class="btn btn-primary" @click="confirmAction">
            {{ $t('GenericBtn.BtnConfirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  TitleText: {
    type: String,
    default: 'Confirmar Acción',
  },
  BodyText: {
    type: String,
    default: '¿Está seguro de que desea realizar esta acción?',
  },
});

const emit = defineEmits(['confirm']);

const confirmAction = () => {
  emit('confirm');
};
</script>
