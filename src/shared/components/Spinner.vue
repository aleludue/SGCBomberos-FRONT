<template>
  <div v-if="showSpin" class="spinner-overlay">
    <div class="spinner-border text-dark" style="width: 3rem; height: 3rem" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    <p class="mt-2 text-dark">{{ effectiveText }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { textDetail = '', showSpin = false } = defineProps(['textDetail', 'showSpin']);
const effectiveText = computed(() => textDetail || t('GenericTexts.BaseLoadMsg'));
</script>
