<template>
  <div class="text-center mt-3">
    <button class="btn btn-outline-primary" @click="goBack">
      <i class="bi bi-arrow-return-left"></i>
      {{ $t('GenericBtn.BtnBack') }}
    </button>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  toHome?: boolean;
}>();

const goBack = () => {
  if (props.toHome) {
    router.push({ name: 'home' });
  } else {
    router.back();
  }
};
</script>
