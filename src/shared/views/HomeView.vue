<template>
  <title>{{ $t('HomeView.ViewTitle') }}</title>
  <div class="container">
    <SectionTitle :title="$t('HomeView.SectionTitle') + userDat.user?.fullName" />
  </div>
</template>

<script setup lang="ts">
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useAuthStore } from '@/shared/stores/auth.store';

const userDat = useAuthStore();
</script>
