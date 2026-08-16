<template>
  <div class="container">
    <SectionTitle
      :title="$t('InstitutionViews.MenuTitle')"
      :subtitle="$t('InstitutionViews.MenuSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('InstitutionViews.MenuTitle') }]"
    />

    <div class="row d-flex flex-wrap">
      <MenuAction
        :title="$t('InstitutionViews.ManageTitle')"
        :subtitle="$t('InstitutionViews.ManageSubtitle')"
        url="/institution/edit"
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
