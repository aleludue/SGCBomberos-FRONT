<template>
  <div class="container">
    <SectionTitle
      :title="t('VehiclesViews.NewTitle')"
      :subtitle="t('VehiclesViews.NewSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('VehiclesViews.MenuTitle'), link: '/vehicles' },
        { detail: t('VehiclesViews.ConsultTitle'), link: '/vehicles/consult' },
        { detail: t('VehiclesViews.NewTitle') },
      ]"
    />

    <VehiTabs />

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';

import VehiTabs from '@/features/vehicles/components/VehiTabs.vue';

const { desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();

onMounted(() => {
  desactivateSpinner();
});
</script>
