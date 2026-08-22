<template>
  <div class="container">
    <SectionTitle
      :title="$t('VehiclesViews.MenuTitle')"
      :subtitle="$t('VehiclesViews.MenuSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('VehiclesViews.MenuTitle') }]"
    />

    <div class="row d-flex flex-wrap">
      <MenuAction
        :title="$t('VehiclesViews.NewTitle')"
        :subtitle="$t('VehiclesViews.NewSubtitle')"
        icon="bi-plus-circle-dotted"
        url="/vehicles/new"
      />

      <MenuAction
        :title="$t('VehiclesViews.ConsultTitle')"
        :subtitle="$t('VehiclesViews.ConsultSubtitle')"
        url="/vehicles/consult"
      />

      <MenuAction
        :title="$t('VehiclesViews.TypesTitle')"
        :subtitle="$t('VehiclesViews.TypesSubtitle')"
        icon="bi-pass"
        url="/vehicles/types"
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
