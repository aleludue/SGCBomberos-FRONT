<template>
  <main>
    <p>Homeeeee</p>
    <button @click="testFunc">Go to Dashboard</button>
  </main>
</template>

<script setup lang="ts">
import { checkAppState } from '@/features/account/services/check-auth.action';

const testFunc = () => {
  //verificar si el usuario esta autenticado
  checkAppState();
};
</script>
