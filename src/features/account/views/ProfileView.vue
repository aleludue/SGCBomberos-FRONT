<template>
  <div class="container">
    <SectionTitle title="Perfil" subtitle="Detalle completo de los datos del usuario" />

    <button class="btn btn-primary mb-3" @click="configStore.activeSpinner()">Spinner</button>
    <button class="btn btn-primary mb-3" @click="configStore.darkMode()">Modo Oscuro</button>
    <button class="btn btn-primary mb-3" @click="configStore.lightMode()">Modo Claro</button>

    <BtnBack />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

const configStore = useSiteConfigStore();

onMounted(() => {
  console.log('ProfileView mounted');
});
</script>
