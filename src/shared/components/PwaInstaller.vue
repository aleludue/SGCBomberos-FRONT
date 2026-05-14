<template>
  <div v-if="showInstallButton" class="w-100 pwa-installer-container">
    <div
      class="alert border border-secondary-subtle bg-body-secondary text-body d-flex align-items-center shadow-sm p-3 mb-0"
      role="alert"
    >
      <div
        class="flex-shrink-0 text-center d-flex align-items-center justify-content-center text-orange-fire"
      >
        <i class="bi bi-info-circle fs-4"></i>
      </div>

      <div class="flex-grow-1 px-3">
        <button
          type="button"
          class="btn btn-link p-0 text-decoration-none btn-pwa-link fw-semibold text-start w-100"
          @click="installPWA"
        >
          {{ $t('Messages.PwaInstall') }}
          <i class="bi bi-download ms-2"></i>
        </button>
      </div>

      <div class="flex-shrink-0">
        <button
          type="button"
          class="btn-close btn-close-themed"
          data-bs-dismiss="alert"
          aria-label="Close"
          @click="showInstallButton = false"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const showInstallButton = ref(false);
let deferredPrompt: any = null;

const handleBeforeInstall = (e: Event) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton.value = true;
};

const handleAppInstalled = () => {
  showInstallButton.value = false;
  deferredPrompt = null;
};

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstall);
  window.addEventListener('appinstalled', handleAppInstalled);
});

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  window.removeEventListener('appinstalled', handleAppInstalled);
});

const installPWA = async () => {
  if (!deferredPrompt) return;
  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    showInstallButton.value = false;
    deferredPrompt = null;
  }
};
</script>

<style scoped>
.pwa-installer-container .alert {
  border-radius: 12px !important;
  transition: all 0.25s ease;
}

.btn-pwa-link {
  color: var(--bs-body-color) !important;
  font-size: 0.85rem;
}

.btn-pwa-link:hover {
  color: #ff6b00 !important;
}

[data-bs-theme='dark'] .btn-close-themed,
.login-card-tactical :deep(.btn-close-themed) {
  filter: invert(1) brightness(1);
}

.pwa-installer-container {
  animation: slideDownSmooth 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDownSmooth {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
