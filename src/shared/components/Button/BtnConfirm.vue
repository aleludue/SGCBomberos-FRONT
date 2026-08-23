<template>
  <button
    :type="type"
    class="btn d-inline-flex align-items-center justify-content-center px-5 py-2 shadow-sm fw-bold"
    :class="[sizeClass, blockClass]"
    v-bind="$attrs"
  >
    <i class="bi" :class="icon"></i>{{ textDetail }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset';
    size?: 'sm' | 'md' | 'lg';
    block?: boolean;
    textDetail?: string;
    icon?: string;
  }>(),
  {
    type: 'button',
    size: 'sm',
    block: false,
    textDetail: '',
    icon: 'bi-save',
  },
);

const type = props.type ?? 'button';
const sizeClass = computed(() =>
  props.size === 'sm' ? 'btn-sm' : props.size === 'lg' ? 'btn-lg' : 'btn-md',
);
const blockClass = computed(() => (props.block ? 'w-100' : ''));
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: auto;
  max-width: 100%;
  background-color: var(--brand-primary);
  color: var(--bs-on-brand-color);
  font-weight: 700;
  border: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(var(--brand-primary-rgb), 0.15);
}

@media (max-width: 575.98px) {
  .btn {
    width: 100% !important;
  }
}

.btn:hover {
  background-color: var(--brand-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(var(--brand-primary-rgb), 0.35);
}
</style>
