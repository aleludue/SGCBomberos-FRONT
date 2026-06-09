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
import { useAuthStore } from '@/shared/stores/auth.store';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { AuthStatus } from '@/features/login/interfaces';
import SideMenu from '@/shared/components/SideMenu.vue';
import Spinner from '@/shared/components/Spinner.vue';
import PwaUpdate from '@/shared/components/PwaUpdate.vue';
import { useAppSettings } from '@/shared/composables/useAppSettings';

const authStore = useAuthStore();
const configStore = useSiteConfigStore();

useAppSettings();
</script>
