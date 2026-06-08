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

      <PwaUpdate />
    </main>

    <footer
      v-if="authStore.authStatus == AuthStatus.Authenticated"
      class="app-footer text-center py-3"
    >
      <p class="mb-0">
        @ Copyright {{ new Date().getFullYear() }} - {{ $t('SystemBase.NameLong') }}
      </p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { configYupMsg } from '@/config/yup';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { AuthStatus } from '@/features/login/interfaces';
import SideMenu from '@/shared/components/SideMenu.vue';
import Spinner from '@/shared/components/Spinner.vue';
import PwaUpdate from '@/shared/components/PwaUpdate.vue';

const authStore = useAuthStore();
const configStore = useSiteConfigStore();
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
</script>
