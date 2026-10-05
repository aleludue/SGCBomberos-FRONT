<template>
  <div class="container">
    <SectionTitle
      :title="$t('BomberosViews.EditTitle')"
      :subtitle="$t('BomberosViews.EditSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('BomberosViews.MenuTitle'), link: '/bomberos' },
        { detail: $t('BomberosViews.ConsultTitle'), link: '/bomberos/consult' },
        { detail: $t('BomberosViews.EditTitle') },
      ]"
    />

    <BombTabs />

    <BtnBack :toHome="false" />
  </div>
</template>

<script setup lang="ts">
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';

import BombTabs from '@/features/bomberos/components/BombTabs.vue';
</script>
