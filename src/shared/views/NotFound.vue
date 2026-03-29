<template>
  <title>{{ $t('NotFoundView.ViewTitle') }}</title>

  <div class="container text-center">
    <h1>{{ $t('NotFoundView.Title') }}</h1>
    <p>{{ $t('NotFoundView.Subtitle') }}</p>
    <BtnBack :toHome="true" />
  </div>
</template>
<script lang="ts" setup>
import BtnBack from '@/shared/components/BtnBack.vue';
</script>
