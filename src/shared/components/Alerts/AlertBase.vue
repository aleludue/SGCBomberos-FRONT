<template>
  <div class="alert m-0 text-center p-2" :class="alertStyle" role="alert">
    {{ labelText }}
  </div>
</template>

<script setup lang="ts">
const { labelText = undefined, alertStyle = 'alert-info' } = defineProps([
  'labelText',
  'alertStyle',
]);
</script>
