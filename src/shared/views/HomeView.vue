<template>
  <main>
    <SideMenu />
  </main>
</template>

<script setup lang="ts">
import { checkAppState } from '@/features/account/services/check-auth.action';
import SideMenu from '@/shared/components/SideMenu.vue';

const testFunc = () => {
  //verificar si el usuario esta autenticado
  checkAppState();
};
</script>
