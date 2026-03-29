<template>
  <title>{{ $t('BomberMenuView.ViewTitle') }}</title>
  <div class="container">
    <SectionTitle :title="$t('BomberMenuView.Title')" :subtitle="$t('BomberMenuView.Subtitle')" />

    <div class="row d-flex flex-wrap mt-4">
      <MenuAction
        :title="$t('BomberMenuView.ConsultOptionTitle')"
        :subtitle="$t('BomberMenuView.ConsultOptionSubtitle')"
        url="/bomberos/consult"
      />

      <MenuAction
        :title="$t('BomberMenuView.RequestsOptionTitle')"
        :subtitle="$t('BomberMenuView.RequestsOptionSubtitle')"
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
