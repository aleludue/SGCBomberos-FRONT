<template>
  <div class="d-flex flex-column rounded p-3 border flex-grow-1 flex-sm-grow-0 align-items-center">
    <p class="form-label">{{ labelText }}</p>

    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="switchInput"
        v-model="switchState"
      />
      <label class="form-check-label" for="switchInput">
        {{ switchState ? textActive : textInactive }}
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {
  labelText = 'Estado:',
  textActive = 'Activo',
  textInactive = 'Inactivo',
} = defineProps(['labelText', 'textActive', 'textInactive']);

const switchState = defineModel({
  type: Boolean,
  required: true,
  default: false,
});
</script>
