<template>
  <title>SGCB - Bomberos - Menu</title>
  <div class="container">
    <SectionTitle
      title="Bomberos"
      subtitle="Pantalla base con todas las opciones para gestionar bomberos"
    />

    <div class="row d-flex flex-wrap mt-4">
      <MenuAction
        title="Consulta"
        subtitle="Filtros para consultar bomberos registrados en el sistema."
        url="/bomberos/consult"
      />

      <MenuAction
        title="Gestión de solicitudes"
        subtitle="Integrar a un bombero a la institución."
        url="/bomberos/requests"
      />
    </div>

    <BtnBack :toHome="true" />
  </div>
</template>

<script lang="ts" setup>
import BtnBack from '@/shared/components/BtnBack.vue';
import MenuAction from '@/shared/components/MenuAction.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
</script>
