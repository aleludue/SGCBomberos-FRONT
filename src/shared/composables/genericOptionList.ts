import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function genericOptionsList() {
  const { t } = useI18n();

  const genderList = computed(() => [
    { id: 1, name: t('SelectOptions.Male') },
    { id: 2, name: t('SelectOptions.Female') },
    { id: 3, name: t('SelectOptions.Other') },
  ]);

  const statusList = computed(() => [
    { id: 1, name: t('SelectOptions.All') },
    { id: 2, name: t('SelectOptions.Active') },
    { id: 3, name: t('SelectOptions.Inactive') },
  ]);

  return { genderList, statusList };
}
