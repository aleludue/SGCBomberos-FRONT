<template>
  <div class="container">
    <SectionTitle
      :title="$t('AssistanceViews.MenuTitle')"
      :subtitle="$t('AssistanceViews.MenuSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('AssistanceViews.MenuTitle') }]"
    />

    <div class="row d-flex flex-wrap">
      <MenuAction
        :title="$t('AssistanceViews.ConsultTitle')"
        :subtitle="$t('AssistanceViews.ConsultSubtitle')"
        url="/assistances/consult"
      />

      <MenuAction
        :title="$t('AssistanceViews.TypesTitle')"
        :subtitle="$t('AssistanceViews.TypesSubtitle')"
        icon="bi-pass"
        url="/assistances/types"
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
