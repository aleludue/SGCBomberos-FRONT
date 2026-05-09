<template>
  <div v-if="showSpin" class="spinner-overlay">
    <div class="spinner-border text-dark" style="width: 3rem; height: 3rem" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    <p class="mt-2 text-dark font-weight-bold">{{ effectiveText }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  textDetail: { type: String, default: '' },
  showSpin: { type: Boolean, default: false },
});

const effectiveText = computed(() => {
  return props.textDetail || t('GenericTexts.BaseLoadMsg');
});
</script>
