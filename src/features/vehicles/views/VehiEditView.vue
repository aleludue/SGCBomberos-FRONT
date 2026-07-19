<template>
  <div class="container">
    <SectionTitle
      :title="t('VehiclesViews.EditTitle')"
      :subtitle="t('VehiclesViews.EditSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('VehiclesViews.MenuTitle'), link: '/vehicles' },
        { detail: t('VehiclesViews.ConsultTitle'), link: '/vehicles/consult' },
        { detail: t('VehiclesViews.EditTitle') },
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
