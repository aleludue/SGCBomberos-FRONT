<template>
  <div
    class="d-flex flex-column text-start justify-content-start mt-1 mb-1 col-6 col-xs-6 col-sm-6 col-md-4 col-lg-2 custom-switch-wrapper"
  >
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
    </label>

    <div
      class="tactical-switch-card border border-secondary-subtle bg-body-tertiary d-flex align-items-center shadow-sm py-2 px-3 cursor-pointer"
      @click="toggleSwitch"
    >
      <div
        class="custom-tactical-switch-container d-flex align-items-center justify-content-center gap-2 w-100"
      >
        <input
          :id="uuid"
          v-model="switchState"
          v-bind="$attrs"
          type="checkbox"
          class="visually-hidden"
          @click.stop
        />

        <div class="tactical-switch-track" :class="{ 'is-checked': switchState }">
          <div class="tactical-switch-handle"></div>
        </div>

        <span class="text-themed-status fw-semibold small m-0">
          {{ switchState ? textActive : textInactive }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useId } from 'vue';

defineOptions({ inheritAttrs: false });

const uuid = useId();

withDefaults(
  defineProps<{
    labelText?: string;
    textActive?: string;
    textInactive?: string;
  }>(),
  {
    labelText: 'Estado:',
    textActive: 'Activo',
    textInactive: 'Inactivo',
  },
);

const switchState = defineModel<boolean>({
  required: true,
  default: false,
});

const toggleSwitch = () => {
  switchState.value = !switchState.value;
};
</script>

<style scoped>
.custom-switch-wrapper {
  user-select: none;
}

.tactical-switch-card {
  height: 45px;
  border-radius: 8px !important;
  transition: all 0.2s ease;
  background-color: var(--bs-input-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
}

.tactical-switch-card:hover .tactical-switch-track {
  border-color: var(--brand-primary);
}

.text-themed-status {
  color: var(--bs-body-color);
}

.tactical-switch-track {
  width: 2.5rem;
  height: 1.25rem;
  border-radius: 30px;
  position: relative;
  transition:
    background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.2s ease;
  flex-shrink: 0;
  background-color: var(--bs-input-bg) !important;
  border: 1px solid var(--bs-border-color);
}

.tactical-switch-handle {
  width: 0.95rem;
  height: 0.95rem;
  background-color: var(--bs-on-brand-color);
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.tactical-switch-track.is-checked {
  background-color: var(--brand-primary) !important;
  border-color: var(--brand-primary) !important;
}

.tactical-switch-track.is-checked .tactical-switch-handle {
  transform: translateX(1.15rem);
}
</style>
