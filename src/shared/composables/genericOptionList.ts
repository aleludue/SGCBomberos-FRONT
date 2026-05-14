import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function genericOptionsList() {
  const { t } = useI18n();

  const genderList = computed(() => [
    { id: 1, name: t('SelectOptions.Male') },
    { id: 2, name: t('SelectOptions.Female') },
    { id: 3, name: t('SelectOptions.Other') },
  ]);

  return { genderList };
}
