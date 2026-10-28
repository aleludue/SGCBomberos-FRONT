<template>
  <div class="container">
    <SectionTitle
      :title="$t('TurnsViews.ConfigTitle')"
      :subtitle="$t('TurnsViews.ConfigSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('TurnsViews.MenuTitle'), link: '/turns' },
        { detail: $t('TurnsViews.ConfigTitle') },
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
