<template>
  <div class="container">
    <h2>{{ props.title }}</h2>
    <p v-if="props.subtitle">{{ props.subtitle }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
