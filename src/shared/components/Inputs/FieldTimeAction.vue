<template>
  <div class="col-12 col-md-6 col-lg-4">
    <label :for="uuid" class="form-label">
      {{ labelText }}
    </label>

    <div class="input-group">
      <input
        :id="uuid"
        v-model="searchValue"
        v-bind="$attrs"
        type="text"
        class="form-control"
        @input="handleInput"
      />

      <span v-if="isLoading" role="button" class="input-group-text">
        <div class="spinner-grow spinner-grow-sm text-secondary" role="status"></div>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, useId, onUnmounted } from 'vue';

defineOptions({ inheritAttrs: false });

const uuid = useId();
const isLoading = ref(false);
let timeout: ReturnType<typeof setTimeout> | null = null;

const props = defineProps({
  labelText: { type: String, default: '' },
  delay: { type: Number, default: 1500 },
});

const searchValue = defineModel<string>();
const emit = defineEmits(['applySearch']);

const handleInput = () => {
  isLoading.value = true;

  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    emit('applySearch', searchValue.value);
    isLoading.value = false;
  }, props.delay);
};

onUnmounted(() => {
  if (timeout) clearTimeout(timeout);
});
</script>
