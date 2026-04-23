<template>
  <label for="searchInput" class="form-label">
    {{ labelText }}
  </label>
  <input type="text" class="form-control" id="searchInput" :value="valueText" @input="onInput" />
</template>

<script lang="ts" setup>
import { watch } from 'vue';

let timeout: ReturnType<typeof setTimeout> | null = null;

const { labelText = undefined, valueText = undefined } = defineProps(['labelText', 'valueText']);

const emit = defineEmits(['applySearch', 'update:value']);
let userInput = false;

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  userInput = true;
  emit('update:value', target.value);
};

const realizarBusqueda = (value: string) => {
  emit('applySearch', value);
};

watch(
  () => valueText,
  (newVal) => {
    if (newVal === undefined || !userInput) {
      userInput = false;
      return;
    }

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      if (newVal.trim() !== '') {
        realizarBusqueda(newVal);
      }
      userInput = false;
    }, 1500);
  },
  { immediate: false },
);
</script>
