<template>
  <div class="container">
    <SectionTitle
      :title="t('AssistanceViews.TypesTitle')"
      :subtitle="t('AssistanceViews.TypesSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('AssistanceViews.MenuTitle'), link: '/assistances' },
        { detail: t('AssistanceViews.TypesTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2"></div>

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';

import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import BtnBack from '@/shared/components/Button/BtnBack.vue';

const { t } = useI18n();
const { desactivateSpinner } = useSiteConfigStore();

onMounted(async () => {
  desactivateSpinner();
});
</script>
