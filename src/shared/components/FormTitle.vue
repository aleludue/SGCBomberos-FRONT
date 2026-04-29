<template>
  <div class="d-flex mb-2" :class="marginTop ? 'mt-3' : ''">
    <hr class="flex-grow-1" />
    <h4 class="mx-3 mb-0">{{ titleText }}</h4>
    <hr class="flex-grow-1" />
  </div>
</template>

<script lang="ts" setup>
const { titleText = undefined, marginTop = false } = defineProps(['titleText', 'marginTop']);
</script>
