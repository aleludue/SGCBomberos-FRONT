<template>
  <div class="container mt-4">
    <SectionTitle :title="titleDetail" :show-logo="false" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useAuthStore } from '@/shared/stores/auth.store';

const { t } = useI18n();
const authStore = useAuthStore();

const titleDetail = computed(() => {
  const name = authStore.user?.fullName ?? '';
  return `${t('BaseViews.HomeSubtitle')} ${name}`.trim();
});
</script>
