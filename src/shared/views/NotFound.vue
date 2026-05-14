<template>
  <div class="container text-center not-found-wrapper">
    <div class="row justify-content-center w-100">
      <div class="col-12 col-md-8 col-lg-6 d-flex flex-column align-items-center">
        <h1 class="display-1 fw-black text-orange-404 mb-0 animate-pulse">404</h1>

        <h2 class="mb-2 fw-bold text-themed-main fs-2">
          {{ $t('BaseViews.NotFoundTitle') }}
        </h2>

        <p class="lead mb-4 text-secondary-themed px-3">
          {{ $t('BaseViews.NotFoundSubtitle') }}
        </p>

        <div class="btn-back-center">
          <BtnBack :to-home="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BtnBack from '@/shared/components/BtnBack.vue';
</script>

<style scoped>
.not-found-wrapper {
  min-height: 65vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
}

.fw-black {
  font-weight: 900;
  letter-spacing: -2px;
}

.text-orange-404 {
  color: #ff6b00 !important;
  text-shadow: 0 4px 20px rgba(255, 107, 0, 0.15);
}

.text-themed-main {
  color: var(--bs-body-color);
}

.text-secondary-themed {
  color: var(--bs-secondary-color) !important;
  font-size: 1.1rem;
  font-weight: 500;
}

.btn-back-center :deep(.d-flex) {
  justify-content: center !important;
}

.animate-pulse {
  animation: pulseSutil 3s infinite ease-in-out;
}

@keyframes pulseSutil {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.95;
    transform: scale(0.98);
  }
}

[data-bs-theme='dark'] .text-orange-404 {
  text-shadow: 0 0 30px rgba(255, 107, 0, 0.25);
}
</style>
