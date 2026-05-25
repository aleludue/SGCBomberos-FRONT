<template>
  <div class="col-12 col-lg-6 mb-3 d-flex">
    <div
      class="card w-100 custom-navigation-card border-secondary-subtle bg-body-tertiary"
      @click="goToUrl"
      role="button"
      tabindex="0"
      @keydown.enter="goToUrl"
    >
      <div
        v-if="title"
        class="card-header fw-bold border-bottom text-body bg-transparent py-3 px-4"
      >
        {{ title }}
      </div>

      <div class="card-body d-flex align-items-center p-4">
        <div class="icon-container-card d-flex align-items-center justify-content-center me-3">
          <i class="bi" :class="icon ?? 'bi-search'"></i>
        </div>
        <p v-if="subtitle" class="card-text mb-0 small-themed-text">
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

const goToUrl = async () => {
  if (props.url) {
    await router.push({ path: props.url });
  }
};
</script>

<style scoped>
.custom-navigation-card {
  cursor: pointer;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.icon-container-card {
  color: #ff6b00;
  font-size: 2.25rem;
  transition: transform 0.25s ease;
}

/* Texto de descripción acoplado al tema */
.small-themed-text {
  color: var(--bs-secondary-color) !important;
  font-weight: 500;
  line-height: 1.4;
}

.custom-navigation-card:hover {
  transform: translateY(-4px);
  border-color: #ff6b00 !important;
  box-shadow: 0 8px 24px rgba(255, 107, 0, 0.12) !important;
}

.custom-navigation-card:hover .icon-container-card {
  transform: scale(1.1);
}

.custom-navigation-card:focus-visible {
  outline: none;
  border-color: #ff6b00 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.25) !important;
}

[data-bs-theme='dark'] .custom-navigation-card {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
}

[data-bs-theme='dark'] .custom-navigation-card:hover {
  box-shadow: 0 8px 24px rgba(255, 107, 0, 0.2) !important;
  background-color: var(--bs-secondary-bg) !important;
}
</style>
