<template>
  <div
    class="site"
    :class="{ 'fondo-container': authStore.authStatus == AuthStatus.Unauthenticated }"
    v-cloak
  >
    <!-- Menú Lateral (Solo autenticados) -->
    <SideMenu v-if="authStore.authStatus == AuthStatus.Authenticated" />

    <main class="main" id="mainPrincipal">
      <!-- Spinner Global -->
      <Spinner
        :showSpin="configStore.configs.spinnerShow"
        :textDetail="configStore.configs.spinerText"
      ></Spinner>

      <RouterView />
    </main>

    <!-- Footer (Solo autenticados) -->
    <footer
      v-if="authStore.authStatus == AuthStatus.Authenticated"
      class="app-footer text-center py-3"
    >
      <p class="mb-0">
        @ Copyright {{ new Date().getFullYear() }} - {{ $t('GenericTexts.SistemNameLong') }}
      </p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

import router from '@/router';
import { configYupMsg } from '@/config/yup';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { useMenuStore } from '@/shared/stores/menu.store';
import { AuthStatus } from '@/features/login/interfaces';
import SideMenu from '@/shared/components/SideMenu.vue';
import Spinner from '@/shared/components/Spinner.vue';

const authStore = useAuthStore();
const configStore = useSiteConfigStore();
const menuStore = useMenuStore();
const { locale, t } = useI18n();

watch(
  () => configStore.configs.siteColorMode,
  (newMode) => {
    let targetMode = newMode;
    if (newMode === 'default') {
      targetMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-bs-theme', targetMode);
  },
  { immediate: true },
);

watch(
  () => configStore.configs.siteLanguage,
  (newLang) => {
    locale.value = newLang;
    configYupMsg(t);
  },
  { immediate: true },
);

watch(
  () => menuStore.menu,
  (newMenu) => {
    if (!newMenu?.length) return;

    newMenu.forEach((routeInfo) => {
      const register = (item: any) => {
        if (!router.hasRoute(item.name)) {
          router.addRoute({
            path: item.route,
            name: item.name,
            props: true,
            component: () => import(`@/features/${item.feature}/views/${item.viewName}.vue`),
            meta: { title: item.title },
          });
        }
      };

      register(routeInfo);
      routeInfo.subMenu?.forEach(register);
    });
  },
  { immediate: true },
);

watch(
  () => authStore.authStatus,
  (newStatus) => {
    if (
      newStatus === AuthStatus.Authenticated &&
      router.currentRoute.value.path.includes('/auth')
    ) {
      router.replace({ name: 'home' });
    }
  },
);

watch(
  () => router.currentRoute.value,
  async () => {
    await nextTick();
    configStore.deactivateSpinner();
  },
);
</script>
