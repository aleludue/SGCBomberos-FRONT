<template>
  <div class="d-flex align-items-center mb-2 tactical-title-container">
    <div class="d-flex align-items-center gap-2 w-100">
      <h4
        v-if="titleText"
        class="mb-0 fw-bold text-themed-title text-uppercase font-tactical-header"
      >
        {{ titleText }}
      </h4>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    titleText?: string;
  }>(),
  {
    titleText: '',
  },
);
</script>

<style scoped>
.tactical-title-container {
  border-left: 5px solid var(--brand-primary);
  padding-left: 10px;
  user-select: none;
}

.font-tactical-header {
  font-size: 1.1rem !important;
  letter-spacing: 0.75px;
  font-weight: 700 !important;
}

.text-themed-title {
  color: var(--bs-heading-color, var(--bs-body-color));
  opacity: 0.9;
}
</style>
