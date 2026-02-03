<template>
  <title>SGCB - Bomberos</title>
  <div class="container">
    <SectionTitle
      title="Bomberos"
      subtitle="Pantalla base con todas las opciones para gestionar bomberos"
    />

    <BtnBack :toHome="true" />
  </div>
</template>

<script lang="ts" setup>
import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
</script>
