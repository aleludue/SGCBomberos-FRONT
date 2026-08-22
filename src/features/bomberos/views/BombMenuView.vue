<template>
  <div class="container">
    <SectionTitle
      :title="$t('BomberosViews.MenuTitle')"
      :subtitle="$t('BomberosViews.MenuSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('BomberosViews.MenuTitle') }]"
    />

    <div class="row d-flex flex-wrap">
      <MenuAction
        :title="$t('BomberosViews.ConsultTitle')"
        :subtitle="$t('BomberosViews.ConsultSubtitle')"
        url="/bomberos/consult"
      />

      <MenuAction
        :title="$t('BomberosViews.RequestsTitle')"
        :subtitle="$t('BomberosViews.RequestsSubtitle')"
        icon="bi-plus-slash-minus"
        url="/bomberos/requests"
      />
    </div>

    <BtnBack :toHome="true" />
  </div>
</template>

<script lang="ts" setup>
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import MenuAction from '@/shared/components/MenuAction.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { onMounted } from 'vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

const { desactivateSpinner } = useSiteConfigStore();

onMounted(() => {
  desactivateSpinner();
});
</script>
