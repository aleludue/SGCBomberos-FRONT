<template>
  <div class="container">
    <SectionTitle
      :title="$t('InterventionViews.EditTitle')"
      :subtitle="$t('InterventionViews.EditSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('InterventionViews.MenuTitle'), link: '/interventions' },
        { detail: $t('InterventionViews.ConsultTitle'), link: '/interventions/consult' },
        { detail: $t('InterventionViews.EditTitle') },
      ]"
    />

    <IntervTabs />

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import IntervTabs from '@/features/interventions/components/IntervTabs.vue';

const { desactivateSpinner } = useSiteConfigStore();

onMounted(() => {
  desactivateSpinner();
});
</script>
