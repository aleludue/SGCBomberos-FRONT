import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function genericOptionsList() {
  const { t } = useI18n();

  const genderList = computed(() => [
    { id: 1, name: t('ProfileView.GenderMale') },
    { id: 2, name: t('ProfileView.GenderFemale') },
    { id: 3, name: t('ProfileView.GenderOther') },
  ]);

  return { genderList };
}
