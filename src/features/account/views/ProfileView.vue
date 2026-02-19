<template>
  <title>{{ $t('ProfileView.ViewTitle') }}</title>

  <div class="container">
    <SectionTitle
      :title="$t('ProfileView.Title')"
      :subtitle="$t('ProfileView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('ProfileView.Title') }]"
    />

    <h3 class="mb-3 mt-4">Datos basicos</h3>

    <div class="flex-wrap row g-3 align-items-center">
      <div class="col-sm-6 col-xs-12">
        <label for="formFullName" class="form-label">Nombre completo:</label>
        <input
          type="text"
          class="form-control"
          id="formFullName"
          :value="profileDetails.fullName"
        />
      </div>

      <div class="col-sm-6 col-xs-12">
        <label for="formGenero" class="form-label">Género:</label>
        <select class="form-select" id="formGenero" :value="profileDetails.sex">
          <option selected>Seleccione su genero...</option>
          <option value="1">Hombre</option>
          <option value="2">Mujer</option>
          <option value="3">Otro</option>
        </select>
      </div>

      <div class="col-sm-6 col-xs-12">
        <label for="formEmail" class="form-label">Correo electrónico:</label>
        <div class="col-sm-10">
          <input
            type="email"
            readonly
            class="form-control-plaintext"
            id="formEmail"
            :value="profileDetails.email"
          />
        </div>
      </div>

      <div class="col-sm-6 col-xs-12">
        <label for="formIntNum" class="form-label">Número interno:</label>
        <div class="col-sm-10">
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            id="formIntNum"
            :value="profileDetails.internalNum"
          />
        </div>
      </div>

      <div class="col-sm-6 col-xs-12">
        <label for="formDocNumber" class="form-label">Número de documento:</label>
        <input
          type="text"
          class="form-control"
          id="formDocNumber"
          :value="profileDetails.docNumber"
        />
      </div>

      <div class="col-sm-6 col-xs-12">
        <label for="formDateBirth" class="form-label">Fecha de nacimiento:</label>
        <input
          type="date"
          class="form-control"
          id="formDateBirth"
          :value="
            profileDetails.dateBirth
              ? new Date(profileDetails.dateBirth).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0]
          "
        />
      </div>

      <div class="col-sm-6 col-xs-12">
        <label for="formHomePhone" class="form-label">Teléfono de casa:</label>
        <input
          type="text"
          class="form-control"
          id="formHomePhone"
          :value="profileDetails.homePhone"
        />
      </div>

      <div class="col-sm-6 col-xs-12">
        <label for="formCellPhone" class="form-label">Teléfono celular:</label>
        <input
          type="text"
          class="form-control"
          id="formCellPhone"
          :value="profileDetails.cellPhone"
        />
      </div>
    </div>

    <h3 class="mb-3 mt-4">Domicilio</h3>

    <div class="flex-wrap row g-3 align-items-center">
      <div class="col-sm-6 col-xs-12">
        <label for="formDirection" class="form-label">Calle:</label>
        <input
          type="text"
          class="form-control"
          id="formDirection"
          :value="profileDetails.direction"
        />
      </div>

      <div class="col-xs-4 col-sm-2">
        <label for="formDirNumber" class="form-label">Número:</label>
        <input
          type="text"
          class="form-control"
          id="formDirNumber"
          :value="profileDetails.dirNumber"
        />
      </div>

      <div class="col-xs-4 col-sm-2">
        <label for="formDirFloor" class="form-label">Piso:</label>
        <input
          type="text"
          class="form-control"
          id="formDirFloor"
          :value="profileDetails.dirFloor"
        />
      </div>

      <div class="col-xs-4 col-sm-2">
        <label for="formDirDpto" class="form-label">Departamento:</label>
        <input type="text" class="form-control" id="formDirDpto" :value="profileDetails.dirDpto" />
      </div>

      <div class="col-sm-6 col-xs-12">
        <label for="formProvince" class="form-label">Provincia:</label>
        <select class="form-select" id="formProvince" :value="profileDetails.province">
          <option selected>Seleccione su provincia...</option>
          <option v-for="value in provinceList" :key="value.id" :value="value.name">
            {{ value.name }}
          </option>
        </select>
      </div>

      <div class="col-sm-6 col-xs-12">
        <label for="formLocality" class="form-label">Localidad:</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="searchTerm"
            placeholder="Escribe para buscar..."
          />
          <span v-if="isLoading" class="input-group-text">⏳</span>
        </div>

        <!-- Lista de resultados estilo Select -->
        <div
          v-if="localidadList.length > 0"
          class="list-group mt-1 position-absolute w-100"
          style="z-index: 1000"
        >
          <button
            v-for="option in localidadList"
            :key="option.id"
            type="button"
            class="list-group-item list-group-item-action"
            @click="
              searchTerm = option.name;
              localidadList = [];
            "
          >
            {{ option.name }}
          </button>
        </div>
      </div>
    </div>

    <BtnBack :toHome="true" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getProfileDetail } from '@/features/account/services/profile.action';
import { getProvincesList } from '@/shared/services/generic.action';

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

const provinceList = ref<{ id: number; name: string }[]>([]);
const localidadList = ref<{ id: number; name: string }[]>([]);

const searchTerm = ref('');
const isLoading = ref(false);

onMounted(async () => {
  configStore.activeSpinner(t('ProfileView.LoadSpinMsg'));

  try {
    const profDet = await getProfileDetail();
    const provDetail = await getProvincesList();

    if (profDet.ok && profDet.data && provDetail.ok && provDetail.data) {
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

      provinceList.value = provDetail.data;
    } else {
      toast.error(t('ProfileView.LoadErrorMsg'));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  configStore.deactivateSpinner();
});

watch(searchTerm, async (newVal) => {
  if (newVal.length > 0) {
    // Simulación de búsqueda con un retraso
    localidadList.value = [
      { id: 1, name: 'Localidad 1' },
      { id: 2, name: 'Localidad 2' },
    ];
  } else {
    localidadList.value = [];
  }
  isLoading.value = false;
});
</script>
