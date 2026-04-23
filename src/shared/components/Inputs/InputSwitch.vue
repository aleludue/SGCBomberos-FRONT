<template>
  <div class="d-flex flex-column rounded p-3 border flex-grow-1 flex-sm-grow-0 align-items-center">
    <p class="form-label">{{ labelText }}</p>

    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="switchInput"
        v-model="switchModel"
      />
      <label class="form-check-label" for="switchInput">
        {{ switchModel ? textActive : textInactive }}
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const {
  labelText = 'Estado:',
  textActive = 'Activo',
  textInactive = 'Inactivo',
  switchState = false,
} = defineProps(['labelText', 'switchState', 'textActive', 'textInactive']);

const switchModel = ref(switchState);

const emit = defineEmits(['changeState']);

watch(switchModel, (newVal) => {
  emit('changeState', newVal);
});

watch(
  () => switchState,
  (newVal) => {
    switchModel.value = newVal;
  },
);
</script>
