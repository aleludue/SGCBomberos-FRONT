<template>
  <div class="site">
    <header>
      <SideMenu />
    </header>
    <main class="app-main">
      <section class="container margin-top">
        <RouterView />
        <VueQueryDevtools></VueQueryDevtools>
      </section>
    </main>
    <footer class="app-footer">
      <div class="container">
        <div class="text-center margin-top">
          <p>@ Copyright {{ year }} - Sistema de Gestión para cuarteles de Bomberos</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useAuthStore } from './features/account/stores/auth.store';
import { AuthStatus } from '@/features/account/interfaces';
import { useRoute, useRouter } from 'vue-router';
import SideMenu from '@/shared/components/SideMenu.vue';

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
  },
  {
    immediate: true,
  },
);
</script>

<style scoped>
.site {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
</style>
