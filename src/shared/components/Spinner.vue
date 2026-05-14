<template>
  <Transition name="fade">
    <div v-if="showSpin" class="spinner-overlay-tactical" role="dialog" aria-modal="true">
      <div class="d-flex flex-column align-items-center justify-content-center loader-box">
        <div class="spinner-border text-orange-fire mb-3" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>

        <p class="m-0 text-themed-loader fw-semibold text-center px-4 small-caps-text">
          {{ effectiveText }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  textDetail: {
    type: String,
    default: '',
  },
  showSpin: {
    type: Boolean,
    default: false,
  },
});

const effectiveText = computed(() => {
  return props.textDetail || t('GenericTexts.BaseLoadMsg') || 'Cargando...';
});
</script>

<style scoped>
.spinner-overlay-tactical {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(var(--bs-body-bg-rgb), 0.65) !important;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-box {
  max-width: 320px;
}

.text-orange-fire {
  color: #ff6b00 !important;
  width: 3.25rem !important;
  height: 3.25rem !important;
  border-width: 0.25rem !important;
}

.text-themed-loader {
  color: var(--bs-body-color) !important;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  line-height: 1.4;
}

.small-caps-text {
  text-transform: uppercase;
  font-size: 0.8rem;
  opacity: 0.9;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
