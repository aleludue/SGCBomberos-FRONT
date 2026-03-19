<template>
  <div v-if="showInstallButton" class="col-xs-12 col-sm-6 col-md-4 mx-auto">
    <div class="alert alert-primary d-flex" role="alert">
      <div class="col-1 text-center align-self-center">
        <i class="bi bi-info-circle fs-2"></i>
      </div>

      <div class="col-10">
        <span class="btn btn-link" @click="installPWA">
          <a class="alert-link"> {{ $t('PwaInstaller.AlertText') }}</a>
          <i class="bi bi-download ms-2"></i>
        </span>
      </div>

      <div class="col-1 text-center align-self-center">
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showInstallButton = ref(false);
const isInstalled = ref(false);
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton.value = true;
});

window.addEventListener('appinstalled', () => {
  showInstallButton.value = false;
  isInstalled.value = true;
});

const installPWA = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    showInstallButton.value = false;
    deferredPrompt = null;
  }
};
</script>
