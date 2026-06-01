<template>
  <div class="container">
    <SectionTitle
      title="Vehículos"
      subtitle="Pantalla base con todas las opciones para gestionar vehículos"
    />

    <BtnBack :toHome="true" />
  </div>
</template>

<script lang="ts" setup>
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
</script>
