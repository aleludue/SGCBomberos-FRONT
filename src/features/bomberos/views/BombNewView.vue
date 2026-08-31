<template>
  <div class="container">
    <SectionTitle
      :title="t('BomberosViews.AddTitle')"
      :subtitle="t('BomberosViews.AddSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('BomberosViews.MenuTitle'), link: '/bomberos' },
        { detail: t('BomberosViews.AddTitle') },
      ]"
    />

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';

const { desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();

onMounted(() => {
  desactivateSpinner();
});
</script>
