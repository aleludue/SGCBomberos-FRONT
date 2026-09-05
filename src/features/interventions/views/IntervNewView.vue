<template>
  <div class="container">
    <SectionTitle
      :title="$t('InterventionViews.NewTitle')"
      :subtitle="$t('InterventionViews.NewSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('InterventionViews.MenuTitle'), link: '/interventions' },
        { detail: $t('InterventionViews.NewTitle') },
      ]"
    />

    <BtnBack :toHome="false" />
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
