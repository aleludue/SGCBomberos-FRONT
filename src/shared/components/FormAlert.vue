<template>
  <div
    class="alert mt-1 border border-secondary-subtle bg-body text-body-secondary small d-flex align-items-center gap-2 py-2 px-3 mb-2 rounded-2 shadow-sm"
  >
    <i class="bi bi-info-circle text-orange-fire fs-5"></i>
    <span>{{ textDetail }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    textDetail?: string;
  }>(),
  {
    textDetail: '',
  },
);
</script>
