<template>
  <div class="container">
    <SectionTitle
      :title="$t('TurnsViews.MenuTitle')"
      :subtitle="$t('TurnsViews.MenuSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('TurnsViews.MenuTitle') }]"
    />

    <div class="row d-flex flex-wrap">
      <MenuAction
        :title="$t('TurnsViews.NewTitle')"
        :subtitle="$t('TurnsViews.NewSubtitle')"
        icon="bi-plus-circle-dotted"
        url="/turns/new"
      />

      <MenuAction
        :title="$t('TurnsViews.ConsultTitle')"
        :subtitle="$t('TurnsViews.ConsultSubtitle')"
        url="/turns/consult"
      />

      <MenuAction
        :title="$t('TurnsViews.ConfigTitle')"
        :subtitle="$t('TurnsViews.ConfigSubtitle')"
        icon="bi-gear-wide-connected"
        url="/turns/config"
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
