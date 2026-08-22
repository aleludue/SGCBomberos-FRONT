<template>
  <div class="container">
    <SectionTitle
      :title="$t('ToolsViews.MenuTitle')"
      :subtitle="$t('ToolsViews.MenuSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('ToolsViews.MenuTitle') }]"
    />

    <div class="row d-flex flex-wrap">
      <MenuAction
        :title="$t('ToolsViews.ConsultTitle')"
        :subtitle="$t('ToolsViews.ConsultSubtitle')"
        url="/tools/consult"
      />

      <MenuAction
        :title="$t('ToolsViews.TypesTitle')"
        :subtitle="$t('ToolsViews.TypesSubtitle')"
        icon="bi-pass"
        url="/tools/types"
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
