<template>
  <div class="col-sm-6 col-xs-12 mb-3 d-flex flex-fill">
    <div class="card d-flex flex-fill" style="cursor: pointer" @click="goToUrl">
      <div class="card-header">{{ props.title }}</div>
      <div class="card-body d-flex align-items-center">
        <i class="bi me-3" :class="props.icon || 'bi-search'" style="font-size: 2rem"></i>
        <p class="card-text">
          {{ props.subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useSiteConfigStore } from '@/shared/stores/config.store';

const router = useRouter();
const configStore = useSiteConfigStore();

const props = defineProps<{
  title?: string;
  subtitle?: string;
  url?: string;
  icon?: string;
}>();

const goToUrl = () => {
  if (props.url) {
    configStore.activeSpinner('Loading...');
    router.push({ path: props.url });
  }
};
</script>
