<template>
  <div class="container">
    <h1>Pagina no encontrada!!</h1>
    <button class="btn btn-primary" @click="router.push({ name: 'home' })">Volver</button>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
