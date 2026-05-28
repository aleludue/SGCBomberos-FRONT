<template>
  <div v-if="needRefresh" class="pwa-toast" role="alert">
    <div class="pwa-message">
      <span>Hay una nueva versión disponible del SGC Bomberos.</span>
    </div>
    <div class="pwa-buttons">
      <button class="btn-update" @click="updateServiceWorker()">Actualizar ahora</button>
      <button class="btn-close" @click="close">Cerrar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';

const { needRefresh, updateServiceWorker } = useRegisterSW();

const close = () => {
  needRefresh.value = false;
};
</script>

<style scoped>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 16px;
  border: 1px solid #888888;
  border-radius: 8px;
  z-index: 9999;
  background-color: #212529;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  font-family: sans-serif;
}
.pwa-message {
  margin-bottom: 12px;
  font-size: 14px;
}
.pwa-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
button {
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-update {
  background-color: #dc3545;
  color: white;
}
.btn-close {
  background-color: #6c757d;
  color: white;
}
</style>
