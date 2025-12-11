<template>
  <div class="site">
    <SideMenu v-if="authStore.authStatus == AuthStatus.Authenticated" />
    <main class="main-content" id="mainPrincipal">
      <RouterView />
      <VueQueryDevtools />
    </main>
    <footer class="app-footer" v-if="authStore.authStatus == AuthStatus.Authenticated">
      <p>@ Copyright {{ year }} - {{ TextResource.SistemNameLong }}</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useAuthStore } from './features/account/stores/auth.store';
import { AuthStatus } from '@/features/account/interfaces';
import { useRoute, useRouter } from 'vue-router';
import SideMenu from '@/shared/components/SideMenu.vue';
import TextResource from '@/assets/text-es.json';
import { onMounted, onUnmounted } from 'vue';
import { updateIsMobile } from './shared/utils/genericVars';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const year = new Date().getFullYear();

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

    if (!router.getRoutes().some((x) => x.path == route.path)) {
      router.replace({ name: 'not-found' });
      return;
    }
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
});
</script>
