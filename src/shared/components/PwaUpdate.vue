<template>
  <div v-if="needRefresh && isRunningAsPWA" class="pwa-toast-wrapper">
    <div
      ref="toastRef"
      class="pwa-tactical-toast"
      role="alertdialog"
      aria-labelledby="pwa-toast-title"
      aria-describedby="pwa-toast-desc"
      tabindex="-1"
    >
      <div class="pwa-header-row">
        <div class="pwa-icon-box" aria-hidden="true">
          <i v-if="isUpdating" class="bi bi-gear-fill pwa-spin"></i>
          <i v-else class="bi bi-cloud-arrow-down-fill"></i>
        </div>

        <div class="pwa-text-container">
          <span id="pwa-toast-title" class="pwa-title">{{ $t('BaseViews.UpdateAvailable') }}</span>
          <span id="pwa-toast-desc" class="pwa-message">
            {{ isUpdating ? $t('BaseViews.UpdatingMessage') : $t('BaseViews.UpdateMessage') }}
          </span>
        </div>

        <button
          class="btn-pwa-close-icon"
          @click="close"
          :aria-label="$t('Buttons.Close')"
          :disabled="isUpdating"
        >
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </div>

      <div class="pwa-action-row">
        <button
          class="btn-pwa-update"
          @click="handleUpdate"
          :disabled="isUpdating"
          :aria-busy="isUpdating"
        >
          <i v-if="isUpdating" class="bi bi-arrow-clockwise pwa-spin" aria-hidden="true"></i>
          <i v-else class="bi bi-arrow-clockwise me-2" aria-hidden="true"></i>
          {{ isUpdating ? $t('BaseViews.UpdatingMessageShort') : $t('Buttons.UpdateNow') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';

const isRunningAsPWA = ref(false);
const isUpdating = ref(false);
const toastRef = ref<HTMLElement | null>(null);
let checkIntervalId: ReturnType<typeof setInterval> | null = null;

const { needRefresh, updateServiceWorker } = useRegisterSW();

const checkPWARunningMode = (): void => {
  if (typeof window === 'undefined') return;

  isRunningAsPWA.value =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone ||
    document.referrer.includes('android-app://');
};

const triggerSWUpdate = (): void => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistration()
      .then((reg) => reg?.update())
      .catch((err) => console.error('Error buscando actualizaciones:', err));
  }
};

const handleUpdate = async (): Promise<void> => {
  if (isUpdating.value) return;
  try {
    isUpdating.value = true;
    await updateServiceWorker(true);
  } catch (error) {
    isUpdating.value = false;
    console.error('Error al actualizar el Service Worker:', error);
  }
};

watch(needRefresh, async (newValue) => {
  if (newValue) {
    checkPWARunningMode();
    if (!isRunningAsPWA.value) {
      await handleUpdate();
    } else {
      await nextTick();
      toastRef.value?.focus();
    }
  }
});

const handleVisibilityChange = (): void => {
  if (document.visibilityState === 'visible') {
    triggerSWUpdate();
  }
};

onMounted(() => {
  checkPWARunningMode();
  document.addEventListener('visibilitychange', handleVisibilityChange);
  checkIntervalId = setInterval(triggerSWUpdate, 1800000);
});

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  if (checkIntervalId) {
    clearInterval(checkIntervalId);
  }
});

const close = (): void => {
  needRefresh.value = false;
};
</script>

<style scoped>
.pwa-toast-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
  padding: 16px;
  pointer-events: none;
}

.pwa-tactical-toast {
  pointer-events: auto;
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  color: var(--bs-body-color);
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.3),
    0 8px 10px -6px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.pwa-header-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
}

.pwa-icon-box {
  background-color: rgba(var(--brand-primary-rgb), 0.1);
  color: var(--brand-primary);
  font-size: 1.2rem;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid rgba(var(--brand-primary-rgb), 0.2);
  flex-shrink: 0;
}

.pwa-text-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  padding-right: 24px;
}

.pwa-title {
  color: var(--bs-heading-color, var(--bs-body-color));
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
}

.pwa-message {
  color: var(--bs-secondary-color);
  font-size: 0.8rem;
  line-height: 1.4;
}

.btn-pwa-close-icon {
  background: transparent;
  border: none;
  color: var(--bs-secondary-color);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  position: absolute;
  top: 0;
  right: 0;
}

.btn-pwa-close-icon:hover {
  color: var(--bs-body-color);
}

.pwa-action-row {
  width: 100%;
}

.btn-pwa-update {
  width: 100%;
  background-color: var(--brand-primary);
  color: var(--bs-on-brand-color);
  border: none;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.btn-pwa-update:hover {
  background-color: var(--brand-primary-dark);
}

.btn-pwa-update:active {
  transform: scale(0.99);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 420px) {
  .pwa-toast-wrapper {
    padding: 12px;
  }
}
</style>
