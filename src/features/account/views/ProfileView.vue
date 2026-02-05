<template>
  <title>{{ $t('ProfileView.ViewTitle') }}</title>

  <div class="container">
    <SectionTitle
      :title="$t('ProfileView.Title')"
      :subtitle="$t('ProfileView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('ProfileView.Title') }]"
    />

    <div class="mt-4">
      <p>Nombre completo: {{ profileDetails.fullName }}</p>
      <p>Correo electrónico: {{ profileDetails.email }}</p>
      <p>Género: {{ profileDetails.sex }}</p>
      <p>Número de documento: {{ profileDetails.docNumber }}</p>
      <p>Número interno: {{ profileDetails.internalNum }}</p>
      <p>Fecha de nacimiento: {{ profileDetails.dateBirth }}</p>
      <p>Dirección: {{ profileDetails.direction }}</p>
      <p>Número de dirección: {{ profileDetails.dirNumber }}</p>
      <p>Piso: {{ profileDetails.dirFloor }}</p>
      <p>Departamento: {{ profileDetails.dirDpto }}</p>
      <p>Localidad: {{ profileDetails.locality }}</p>
      <p>Provincia: {{ profileDetails.province }}</p>
      <p>Teléfono celular: {{ profileDetails.cellPhone }}</p>
      <p>Teléfono de casa: {{ profileDetails.homePhone }}</p>
    </div>

    <BtnBack :toHome="true" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getProfileDetail } from '@/features/account/services/profile.action';

const configStore = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();

const profileDetails = reactive({
  fullName: undefined as string | undefined,
  email: undefined as string | undefined,
  sex: undefined as number | undefined,
  docNumber: undefined as number | undefined,
  internalNum: undefined as number | undefined,
  dateBirth: undefined as Date | undefined,
  direction: undefined as string | undefined,
  dirNumber: undefined as number | undefined,
  dirFloor: undefined as number | undefined,
  dirDpto: undefined as number | undefined,
  locality: undefined as string | undefined,
  province: undefined as string | undefined,
  cellPhone: undefined as string | undefined,
  homePhone: undefined as string | undefined,
});

onMounted(async () => {
  configStore.activeSpinner(t('ProfileView.LoadSpinMsg'));

  try {
    const profDet = await getProfileDetail();

    if (profDet.ok && profDet.data) {
      profileDetails.fullName = profDet.data.fullName;
      profileDetails.email = profDet.data.email;
      profileDetails.sex = profDet.data.gender || undefined;
      profileDetails.docNumber = profDet.data.docNumber || undefined;
      profileDetails.internalNum = profDet.data.internalNum || undefined;
      profileDetails.dateBirth = profDet.data.dateBirth || undefined;
      profileDetails.direction = profDet.data.direction || undefined;
      profileDetails.dirNumber = profDet.data.dirNumber || undefined;
      profileDetails.dirFloor = profDet.data.dirFloor || undefined;
      profileDetails.dirDpto = profDet.data.dirDpto || undefined;
      profileDetails.locality = profDet.data.locality || undefined;
      profileDetails.province = profDet.data.province || undefined;
      profileDetails.cellPhone = profDet.data.cellPhone || undefined;
      profileDetails.homePhone = profDet.data.homePhone || undefined;
    } else {
      toast.error(t('ProfileView.LoadErrorMsg'));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  configStore.deactivateSpinner();
});
</script>
