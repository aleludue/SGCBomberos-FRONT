<template>
  <div
    class="site"
    :class="{ 'fondo-container': authStore.authStatus == AuthStatus.Unauthenticated }"
    v-cloak
  >
    <SideMenu v-if="authStore.authStatus == AuthStatus.Authenticated" />
    <main class="main" id="mainPrincipal">
      <Spinner
        :showSpin="configStore.configs.spinnerShow"
        :textDetail="configStore.configs.spinerText"
      ></Spinner>
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
import { useAuthStore } from '@/shared/stores/auth.store';
import { AuthStatus } from '@/features/account/interfaces';
import SideMenu from '@/shared/components/SideMenu.vue';
import TextResource from '@/assets/text-es.json';
import Spinner from '@/shared/components/Spinner.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMenuStore } from '@/shared/stores/menu.store';
import router from '@/router';

const authStore = useAuthStore();
const configStore = useSiteConfigStore();
const menuStore = useMenuStore();

const { locale } = useI18n();

const year = new Date().getFullYear();

watch(
  () => configStore.configs.siteColorMode,
  (newMode) => {
    if (newMode === 'default') {
      newMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-bs-theme', newMode);
  },
  { immediate: true },
);

watch(
  () => configStore.configs.siteLanguage,
  (newLang) => {
    locale.value = newLang;
  },
  { immediate: true },
);

watch(
  () => menuStore.menu,
  (newMenu) => {
    if (newMenu && newMenu.length > 0) {
      menuStore.menu?.forEach((x) => {
        router.addRoute({
          path: x.route,
          name: x.name,
          props: true,
          component: () => import(`@/features/${x.feature}/views/${x.viewName}.vue`),
        });
      });
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.fondo-container {
  background-image: url('/FondoLogin.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
}
</style>
