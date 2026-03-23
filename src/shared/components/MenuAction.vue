<template>
  <div class="col-sm-6 col-xs-12 mb-3 d-flex flex-fill">
    <div
      class="card border-primary d-flex flex-fill"
      style="cursor: pointer"
      @click="props.url ? router.push({ path: props.url }) : null"
    >
      <div class="card-header">{{ props.title }}</div>
      <div class="card-body text-primary d-flex align-items-center">
        <i class="bi me-2" :class="props.icon || 'bi-search'" style="font-size: 2rem"></i>
        <p class="card-text">
          {{ props.subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  title?: string;
  subtitle?: string;
  url?: string;
  icon?: string;
}>();
</script>
