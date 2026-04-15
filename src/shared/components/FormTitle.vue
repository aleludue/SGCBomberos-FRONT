<template>
  <div class="d-flex gap-2" :class="props.marginTop ? 'mt-3' : ''">
    <hr class="flex-grow-1" />
    <h4 class="mx-3 mb-0">{{ props.titleText }}</h4>
    <hr class="flex-grow-1" />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  titleText: string;
  marginTop?: boolean;
}>();
</script>
