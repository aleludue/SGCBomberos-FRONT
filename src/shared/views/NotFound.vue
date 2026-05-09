<template>
  <div class="container text-center mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="display-1 fw-bold text-primary">404</h1>
        <h2 class="mb-3">{{ $t('NotFoundView.Title') }}</h2>
        <p class="lead mb-4 text-muted">
          {{ $t('NotFoundView.Subtitle') }}
        </p>
        <BtnBack :to-home="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BtnBack from '@/shared/components/BtnBack.vue';
</script>

<style scoped>
.container {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
