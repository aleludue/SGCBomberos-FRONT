<template>
  <div class="container">
    <SectionTitle
      :title="t('VehiclesViews.ConsultTitle')"
      :subtitle="t('VehiclesViews.ConsultSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('VehiclesViews.MenuTitle'), link: '/vehicles' },
        { detail: t('VehiclesViews.ConsultTitle') },
      ]"
    />

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

onMounted(() => {
  desactivateSpinner();
});
</script>
