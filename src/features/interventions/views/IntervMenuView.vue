<template>
  <div class="container">
    <SectionTitle
      :title="$t('InterventionViews.MenuTitle')"
      :subtitle="$t('InterventionViews.MenuSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('InterventionViews.MenuTitle') }]"
    />

    <div class="row d-flex flex-wrap">
      <MenuAction
        :title="$t('InterventionViews.NewTitle')"
        :subtitle="$t('InterventionViews.NewSubtitle')"
        icon="bi-plus-circle-dotted"
        url="/interventions/new"
      />

      <MenuAction
        :title="$t('InterventionViews.ConsultTitle')"
        :subtitle="$t('InterventionViews.ConsultSubtitle')"
        url="/interventions/consult"
      />
    </div>

    <BtnBack :toHome="true" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

import MenuAction from '@/shared/components/MenuAction.vue';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

const { desactivateSpinner } = useSiteConfigStore();

onMounted(() => {
  desactivateSpinner();
});
</script>
