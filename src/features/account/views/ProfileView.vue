<template>
  <div class="container">
    <SectionTitle title="Perfil" subtitle="Detalle completo de los datos del usuario" />

    <BtnBack />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';

onMounted(() => {
  console.log('ProfileView mounted');
});
</script>
