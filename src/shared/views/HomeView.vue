<template>
  <div>
    <h1>Welcome to the Home View</h1>
    <p>This is the main landing page after authentication.</p>
  </div>
</template>

<script setup lang="ts">
import { checkAppState } from '@/features/account/services/check-auth.action';

const testFunc = () => {
  //verificar si el usuario esta autenticado
  checkAppState();
};
</script>
