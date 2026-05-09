<template>
  <div class="col-sm-6 col-xs-12 mb-3 d-flex">
    <div class="card w-100 shadow-sm-hover" style="cursor: pointer" @click="goToUrl" role="button">
      <div v-if="title" class="card-header font-weight-bold">
        {{ title }}
      </div>
      <div class="card-body d-flex align-items-center">
        <i class="bi me-3" :class="icon ?? 'bi-search'" style="font-size: 2rem"></i>
        <p v-if="subtitle" class="card-text mb-0">
          {{ subtitle }}
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

const goToUrl = () => {
  if (props.url) {
    router.push({ path: props.url });
  }
};
</script>
