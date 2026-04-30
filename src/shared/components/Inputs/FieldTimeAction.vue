<template>
  <div class="col-12 col-md-6 col-lg-4">
    <label for="searchInput" class="form-label">
      {{ labelText }}
    </label>
    <div class="input-group">
      <input
        type="text"
        class="form-control"
        id="searchInput"
        :value="searchValue"
        @input="onInput"
      />
      <span v-if="isLoading" role="button" class="input-group-text">
        <div class="spinner-grow spinner-grow-sm text-secondary" role="status"></div>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

let timeout: ReturnType<typeof setTimeout> | null = null;

const searchValue = defineModel({ default: undefined, type: String });
const { labelText = undefined } = defineProps(['labelText']);

const emit = defineEmits(['applySearch']);
let userInput = false;
const isLoading = ref(false);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  userInput = true;
  searchValue.value = target.value;
};

watch(
  () => searchValue.value,
  (newVal) => {
    if (newVal === undefined || !userInput) {
      userInput = false;
      return;
    }

    isLoading.value = true;
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      emit('applySearch');
      userInput = false;
      isLoading.value = false;
    }, 1500);
  },
  { immediate: false },
);
</script>
