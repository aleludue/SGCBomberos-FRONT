<template>
  <RouterView />
  <VueQueryDevtools />
</template>

<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useAuthStore } from './features/account/stores/auth.store';
import { AuthStatus } from '@/features/account/interfaces';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

authStore.$subscribe(
  (_, state) => {
    if (state.authStatus === AuthStatus.Checking) {
      authStore.checkAuthStatus();
      return;
    }

    if (!route.path.includes('/auth') && state.authStatus === AuthStatus.Unauthenticated) {
      router.replace({ name: 'login' });
      return;
    }

    if (route.path.includes('/auth') && state.authStatus === AuthStatus.Authenticated) {
      router.replace({ name: 'home' });
      return;
    }
  },
  {
    immediate: true,
  },
);
</script>
