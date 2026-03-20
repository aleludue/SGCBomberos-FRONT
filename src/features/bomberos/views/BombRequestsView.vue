<template>
  <title>SGCB - Bomberos</title>
  <div class="container">
    <SectionTitle
      title="Bomberos"
      subtitle="Pantalla de gestión de solicitudes para integrar bomberos a la institución."
    />

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
</script>
