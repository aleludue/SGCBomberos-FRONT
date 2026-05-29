<template>
  <div
    class="d-flex align-items-center mb-3 tactical-title-container"
    :class="{ 'mt-2 pt-2': marginTop }"
  >
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
defineProps({
  titleText: { type: String, default: '' },
  marginTop: { type: Boolean, default: false },
});
</script>

<style scoped>
.tactical-title-container {
  border-left: 5px solid var(--brand-primary);
  padding-left: 14px;
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
