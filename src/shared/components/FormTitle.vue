<template>
  <div class="d-flex align-items-center mb-2" :class="{ 'mt-3': marginTop }">
    <hr class="flex-grow-1" />
    <h4 v-if="titleText" class="mx-3 mb-0">{{ titleText }}</h4>
    <hr class="flex-grow-1" />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  titleText?: string;
  marginTop?: boolean;
}>();
</script>

<style scoped>
hr {
  opacity: 0.25;
}
</style>
