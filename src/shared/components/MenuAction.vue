<template>
  <div class="col-sm-6 col-xs-12 mb-3 d-flex flex-fill">
    <div class="card d-flex flex-fill" style="cursor: pointer" @click="goToUrl">
      <div class="card-header">{{ title }}</div>
      <div class="card-body d-flex align-items-center">
        <i class="bi me-3" :class="icon || 'bi-search'" style="font-size: 2rem"></i>
        <p class="card-text">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const {
  title = undefined,
  subtitle = undefined,
  url = undefined,
  icon = undefined,
} = defineProps(['title', 'subtitle', 'url', 'icon']);

const goToUrl = () => {
  if (url) {
    router.push({ path: url });
  }
};
</script>
