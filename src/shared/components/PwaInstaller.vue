<template>
  <div v-if="showInstallButton" class="col-xs-12 col-sm-6 col-4 mx-auto">
    <div class="alert alert-primary d-flex align-items-center" role="alert">
      <div class="flex-shrink-0 text-center">
        <i class="bi bi-info-circle fs-2"></i>
      </div>

      <div class="flex-grow-1 px-3">
        <button
          type="button"
          class="btn btn-link p-0 text-decoration-none alert-link"
          @click="installPWA"
        >
          {{ $t('PwaInstaller.AlertText') }}
          <i class="bi bi-download ms-2"></i>
        </button>
      </div>

      <div class="flex-shrink-0">
        <button
          type="button"
          class="btn-close"
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
