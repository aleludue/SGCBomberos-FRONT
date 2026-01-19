<template>
  <div>
    <!-- Botón solo visible cuando la PWA es instalable -->
    <button v-if="showInstallButton" @click="installPWA" class="install-button">
      Instalar la App
    </button>
    <p v-if="isInstalled">¡Aplicación instalada!</p>
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
  console.log('¡App instalada!');
});

const installPWA = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Usuario eligió: ${outcome}`);
    showInstallButton.value = false;
    deferredPrompt = null;
  }
};
</script>

<style scoped>
.install-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
</style>
