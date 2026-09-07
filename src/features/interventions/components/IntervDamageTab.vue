<template>
  <div class="tab-pane fade" id="damage-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column">
      <FormTitle :titleText="$t('FormSections.BaseData')" />
      <div class="row mb-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FormTitle from '@/shared/components/FormTitle.vue';
</script>
