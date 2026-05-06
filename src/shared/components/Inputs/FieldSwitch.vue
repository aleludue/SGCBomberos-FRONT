<template>
  <div class="d-flex flex-column rounded p-3 border flex-grow-1 flex-sm-grow-0 align-items-center">
    <p class="form-label">{{ labelText }}</p>

    <div class="form-check form-switch">
      <input
        :id="uuid"
        v-model="switchState"
        v-bind="$attrs"
        class="form-check-input"
        type="checkbox"
        role="switch"
      />
      <label class="form-check-label" :for="uuid">
        {{ switchState ? textActive : textInactive }}
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useId } from 'vue';

defineOptions({ inheritAttrs: false });

const uuid = useId();

defineProps({
  labelText: { type: String, default: 'Estado:' },
  textActive: { type: String, default: 'Activo' },
  textInactive: { type: String, default: 'Inactivo' },
});

const switchState = defineModel<boolean>({
  required: true,
  default: false,
});
</script>
