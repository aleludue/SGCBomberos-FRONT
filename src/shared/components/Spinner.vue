<template>
  <div v-if="props.showSpin" class="spinner-overlay">
    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    <p class="mt-2">{{ props.textDetail }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  textDetail: {
    type: String,
    default: 'Cargando...',
  },
  showSpin: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
