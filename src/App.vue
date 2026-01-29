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
    </main>
    <footer class="app-footer" v-if="authStore.authStatus == AuthStatus.Authenticated">
      <p>@ Copyright {{ new Date().getFullYear() }} - {{ $t('SistemNameLong') }}</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import router from '@/router';
import { configYupMsg } from '@/config/yup';

import { useAuthStore } from '@/shared/stores/auth.store';
import { AuthStatus } from '@/features/account/interfaces';
import SideMenu from '@/shared/components/SideMenu.vue';
import Spinner from '@/shared/components/Spinner.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { useMenuStore } from '@/shared/stores/menu.store';

const authStore = useAuthStore();
const configStore = useSiteConfigStore();
const menuStore = useMenuStore();

const { locale, t } = useI18n();

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
    configYupMsg(t);
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
