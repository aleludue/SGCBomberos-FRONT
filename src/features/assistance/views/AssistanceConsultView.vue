<template>
  <div class="container">
    <SectionTitle
      :title="t('AssistanceViews.ConsultTitle')"
      :subtitle="t('AssistanceViews.ConsultSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('AssistanceViews.MenuTitle'), link: '/assistance' },
        { detail: $t('AssistanceViews.ConsultTitle') },
      ]"
    />

    <div class="d-flex flex-column gap-2"></div>

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

const { desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();

onMounted(async () => {
  desactivateSpinner();
});
</script>
