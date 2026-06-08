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
import { onMounted } from 'vue';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

const { desactivateSpinner } = useSiteConfigStore();

onMounted(() => {
  desactivateSpinner();
});
</script>
