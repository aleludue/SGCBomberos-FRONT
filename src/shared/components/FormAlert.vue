<template>
  <div
    class="alert mt-1 border border-secondary-subtle bg-body text-body-secondary small d-flex align-items-center gap-2 py-2 px-3 mb-2 rounded-2 shadow-sm"
  >
    <i class="bi text-orange-fire fs-5" :class="icon"></i>
    <span>{{ textDetail }}</span>

    <div v-if="showButton" class="ms-auto">
      <button type="button" class="btn btn-sm btn-action-edit py-0 px-2" @click="navigateTo">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = withDefaults(
  defineProps<{
    textDetail?: string;
    icon?: string;
    showButton?: boolean;
    buttonText?: string;
    viewName?: string;
  }>(),
  {
    textDetail: '',
    icon: 'bi-info-circle',
    showButton: false,
    buttonText: '',
    viewName: '',
  },
);

const router = useRouter();

const navigateTo = async () => {
  await router.push({ name: props.viewName });
};
</script>
