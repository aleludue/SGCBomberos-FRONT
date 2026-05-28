<template>
  <div v-if="valueText" class="col-12 col-md-6 col-lg-4 text-start mb-2" v-bind="$attrs">
    <label class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
    </label>
    <div
      class="form-control text-truncate font-weight-bold tactical-readonly-box bg-body-secondary border-secondary-subtle"
      :title="valueText"
    >
      <strong>{{ valueText }}</strong>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ inheritAttrs: false });

defineProps({
  labelText: { type: String, default: '' },
  valueText: { type: String, default: '' },
});
</script>

<style scoped>
.text-secondary-themed {
  color: var(--bs-secondary-color, #94a3b8) !important;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.tactical-readonly-box {
  padding: 0.75rem 1rem !important;
  font-size: 0.9rem;
  border-radius: 8px !important;
  cursor: not-allowed;
  user-select: all;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
  background-color: #1e2329 !important;
  border: 1px solid #3f4448 !important;
  color: #adb5bd !important;
}

:global([data-bs-theme='light']) .tactical-readonly-box,
[data-bs-theme='light'] .tactical-readonly-box {
  background-color: #e2e7f0 !important;
  border: 1px solid #cbd5e1 !important;
  color: #64748b !important;
}

.label-plain-themed {
  color: var(--bs-secondary-color);
  font-weight: 500;
}

:global([data-bs-theme='light']) .text-secondary-themed {
  color: var(--bs-secondary-color) !important;
}
</style>
