<template>
  <div class="site" v-cloak>
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

const authStore = useAuthStore();
const configStore = useSiteConfigStore();
const { locale } = useI18n();

const year = new Date().getFullYear();

watch(
  () => configStore.configs.siteColorMode,
  (newMode) => {
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
</script>
