<template>
  <title>{{ $t('ProfileView.ViewTitle') }}</title>

  <div class="container">
    <SectionTitle
      :title="$t('ProfileView.Title')"
      :subtitle="$t('ProfileView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('ProfileView.Title') }]"
    />

    <form @submit.prevent="saveChanges" class="mt-2 p-md-4 rounded shadow">
      <div class="mb-2 d-flex align-items-center text-center">
        <hr class="flex-grow-1" />
        <h4 class="mx-3 mb-0">Datos basicos</h4>
        <hr class="flex-grow-1" />
      </div>

      <div class="flex-wrap row g-3 align-items-center">
        <div class="col-sm-6 col-xs-12">
          <label for="formFullName" class="form-label">Nombre completo:</label>
          <input
            v-model="fullNameValue"
            type="text"
            class="form-control"
            id="formFullName"
            @blur="fullNameBlur"
          />
          <span v-if="fullNameError" class="text-danger">{{ fullNameError }}</span>
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
          <input
            type="email"
            readonly
            class="form-control"
            id="formEmail"
            :value="profileDetails.email"
          />
        </div>

        <div class="col-sm-6 col-xs-12">
          <label for="formIntNum" class="form-label">Número interno:</label>
          <input
            type="text"
            readonly
            class="form-control"
            id="formIntNum"
            :value="profileDetails.internalNum"
          />
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

        <div class="mb-2 mt-5 d-flex align-items-center text-center">
          <hr class="flex-grow-1" />
          <h4 class="mx-3 mb-0">Datos de contacto</h4>
          <hr class="flex-grow-1" />
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

      <div class="mb-2 mt-5 d-flex align-items-center text-center">
        <hr class="flex-grow-1" />
        <h4 class="mx-3 mb-0">Domicilio</h4>
        <hr class="flex-grow-1" />
      </div>

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
          <input
            type="text"
            class="form-control"
            id="formDirDpto"
            :value="profileDetails.dirDpto"
          />
        </div>

        <div class="col-sm-6 col-xs-12">
          <label for="formProvince" class="form-label">Provincia:</label>
          <select class="form-select" id="formProvince" v-model="provSelected">
            <option selected>Seleccione su provincia...</option>
            <option v-for="value in provinceList" :key="value.id" :value="value.id">
              {{ value.name }}
            </option>
          </select>
        </div>

        <div class="col-sm-6 col-xs-12 position-relative">
          <label for="formLocality" class="form-label">Localidad:</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="searchTerm"
              placeholder="Escribe 5 caracteres para buscar..."
            />
            <span v-if="isLoading" class="input-group-text">⏳</span>
          </div>

          <div
            v-if="localidadList.length > 0"
            class="list-group mt-1 position-absolute w-100 pe-3"
            style="z-index: 1000"
          >
            <button
              v-for="option in localidadList"
              :key="option.id"
              type="button"
              class="list-group-item list-group-item-action"
              @click="selectLocality(option)"
            >
              {{ option.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <button class="btn btn-primary" @click="saveChanges">Guardar cambios</button>
      </div>
    </form>

    <BtnBack :toHome="true" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { useField, useForm } from 'vee-validate';

import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getProfileDetail } from '@/features/account/services/profile.action';
import { getLocalitiesList, getProvincesList } from '@/shared/services/generic.action';

const configStore = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();
const settingStore = useSiteConfigStore();

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

const provSelected = ref<number>(0);
const localitySelected = ref<number>(0);

const provinceList = ref<{ id: number; name: string }[]>([]);
const localidadList = ref<{ id: number; name: string }[]>([]);

const searchTerm = ref('');
const isLoading = ref(false);
const lastSelected = ref('');

onMounted(async () => {
  configStore.activeSpinner(t('ProfileView.LoadSpinMsg'));

  try {
    const profDet = await getProfileDetail();
    const provDetail = await getProvincesList();

    if (profDet.ok && profDet.data && provDetail.ok && provDetail.data) {
      provinceList.value = provDetail.data;

      fullNameValue.value = profDet.data.fullName;
      profileDetails.email = profDet.data.email;
      profileDetails.sex = profDet.data.gender || undefined;
      profileDetails.docNumber = profDet.data.docNumber || undefined;
      profileDetails.internalNum = profDet.data.internalNum || undefined;
      profileDetails.dateBirth = profDet.data.dateBirth || undefined;
      profileDetails.direction = profDet.data.direction || undefined;
      profileDetails.dirNumber = profDet.data.dirNumber || undefined;
      profileDetails.dirFloor = profDet.data.dirFloor || undefined;
      profileDetails.dirDpto = profDet.data.dirDpto || undefined;
      searchTerm.value = profDet.data.locality || '';
      lastSelected.value = profDet.data.locality || '';
      provSelected.value = profDet.data.province || 0;
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

const selectLocality = async (option: { id: number; name: string }) => {
  searchTerm.value = option.name;
  localitySelected.value = option.id;
  localidadList.value = [];
  lastSelected.value = option.name;
};

watch(searchTerm, async (newVal) => {
  isLoading.value = true;

  if (newVal.length > 4 && newVal !== lastSelected.value) {
    const locDet = await getLocalitiesList(provSelected.value, newVal);

    if (locDet.ok && locDet.data) {
      localidadList.value = locDet.data;
    }
  } else {
    localidadList.value = [];
  }

  isLoading.value = false;
});

const profileFormEval = yup.object({
  fullName: yup.string().required(),
});

const { handleSubmit } = useForm({
  validationSchema: profileFormEval,
  initialValues: {
    fullName: undefined as string | undefined,
  },
});

const {
  value: fullNameValue,
  errorMessage: fullNameError,
  handleBlur: fullNameBlur,
} = useField('fullName');

const saveChanges = handleSubmit(async (values) => {
  settingStore.activeSpinner('Actualizando perfil...');

  // ver logica para guardar los cambios realizados en el perfil

  settingStore.deactivateSpinner();
});
</script>
