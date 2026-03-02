<template>
  <title>{{ $t('ProfileView.ViewTitle') }}</title>

  <div class="container">
    <SectionTitle
      :title="$t('ProfileView.Title')"
      :subtitle="$t('ProfileView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('ProfileView.Title') }]"
    />

    <form @submit.prevent="saveChanges" class="mt-2 p-3 rounded shadow">
      <div class="mb-2 d-flex align-items-center text-center">
        <hr class="flex-grow-1" />
        <h4 class="mx-3 mb-0">Datos basicos</h4>
        <hr class="flex-grow-1" />
      </div>

      <div class="d-flex align-items-stretch flex-wrap row g-3 align-items-center">
        <div class="col-md-6 col-sm-12 col-xs-12">
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

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formGenero" class="form-label">Género:</label>
          <select class="form-select" id="formGenero" v-model="genderValue" @blur="genderBlur">
            <option value="0" selected>Seleccione su genero...</option>
            <option value="1">Hombre</option>
            <option value="2">Mujer</option>
            <option value="3">Otro</option>
          </select>
          <span v-if="genderError" class="text-danger">{{ genderError }}</span>
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formEmail" class="form-label">Correo electrónico:</label>
          <input
            type="email"
            readonly
            class="form-control"
            id="formEmail"
            :value="profileDetails.email"
          />
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formIntNum" class="form-label">Número interno:</label>
          <input
            type="text"
            readonly
            class="form-control"
            id="formIntNum"
            :value="profileDetails.internalNum"
          />
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formDocNumber" class="form-label">Número de documento:</label>
          <input
            v-model="docNumValue"
            type="text"
            class="form-control"
            id="formDocNumber"
            @blur="docNumBlur"
          />
          <span v-if="docNumError" class="text-danger">{{ docNumError }}</span>
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formDateBirth" class="form-label">Fecha de nacimiento:</label>
          <input
            v-model="birthDateValue"
            type="date"
            class="form-control"
            id="formDateBirth"
            @blur="birthDateBlur"
          />
          <span v-if="birthDateError" class="text-danger">{{ birthDateError }}</span>
        </div>

        <div class="mb-2 mt-4 d-flex align-items-center text-center">
          <hr class="flex-grow-1" />
          <h4 class="mx-3 mb-0">Datos de contacto</h4>
          <hr class="flex-grow-1" />
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formHomePhone" class="form-label">Teléfono de casa:</label>
          <input
            v-model="phoneHomeValue"
            type="text"
            class="form-control"
            id="formHomePhone"
            @blur="phoneHomeBlur"
          />
          <span v-if="phoneHomeError" class="text-danger">{{ phoneHomeError }}</span>
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formCellPhone" class="form-label">Teléfono celular:</label>
          <input
            v-model="phoneCellValue"
            type="text"
            class="form-control"
            id="formCellPhone"
            @blur="phoneCellBlur"
          />
          <span v-if="phoneCellError" class="text-danger">{{ phoneCellError }}</span>
        </div>
      </div>

      <div class="mb-2 mt-4 d-flex align-items-center text-center">
        <hr class="flex-grow-1" />
        <h4 class="mx-3 mb-0">Domicilio</h4>
        <hr class="flex-grow-1" />
      </div>

      <div class="d-flex align-items-stretch flex-wrap row g-3 align-items-center">
        <div class="col-xl-6 col-md-6 col-sm-12 col-xs-12">
          <label for="formDirection" class="form-label">Calle:</label>
          <input
            v-model="dirStreetValue"
            type="text"
            class="form-control"
            id="formDirection"
            @blur="dirStreetBlur"
          />
          <span v-if="dirStreetError" class="text-danger">{{ dirStreetError }}</span>
        </div>

        <div class="col-xl-2 col-md-6 col-sm-12 col-xs-12">
          <label for="formDirNumber" class="form-label">Número:</label>
          <input
            v-model="dirNumValue"
            type="text"
            class="form-control"
            id="formDirNumber"
            @blur="dirNumBlur"
          />
          <span v-if="dirNumError" class="text-danger">{{ dirNumError }}</span>
        </div>

        <div class="col-xl-2 col-md-6 col-sm-12 col-xs-12">
          <label for="formDirFloor" class="form-label">Piso:</label>
          <input
            v-model="dirFloorValue"
            type="text"
            class="form-control"
            id="formDirFloor"
            @blur="dirFloorBlur"
          />
          <span v-if="dirFloorError" class="text-danger">{{ dirFloorError }}</span>
        </div>

        <div class="col-xl-2 col-md-6 col-sm-12 col-xs-12">
          <label for="formDirDpto" class="form-label">Departamento:</label>
          <input
            v-model="dirDptoValue"
            type="text"
            class="form-control"
            id="formDirDpto"
            @blur="dirDptoBlur"
          />
          <span v-if="dirDptoError" class="text-danger">{{ dirDptoError }}</span>
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12">
          <label for="formProvince" class="form-label">Provincia:</label>
          <select
            class="form-select"
            id="formProvince"
            v-model="provSelecValue"
            @blur="provSelecBlur"
          >
            <option value="0" selected>Seleccione su provincia...</option>
            <option v-for="value in provinceList" :key="value.id" :value="value.id">
              {{ value.name }}
            </option>
          </select>
          <span v-if="provSelecError" class="text-danger">{{ provSelecError }}</span>
        </div>

        <div class="col-md-6 col-sm-12 col-xs-12 position-relative">
          <label for="formLocality" class="form-label">Localidad:</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="locSelecValue"
              placeholder="Escribe 5 caracteres para buscar..."
              @blur="locSelecBlur"
            />
            <span v-if="isLoading" class="input-group-text">⏳</span>
          </div>
          <span v-if="locSelecError" class="text-danger">{{ locSelecError }}</span>

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
  email: undefined as string | undefined,
  internalNum: undefined as number | undefined,
  locality: undefined as string | undefined,
  province: undefined as string | undefined,
});

const provSelected = ref<number>(0);
const localitySelected = ref<number>(0);

const provinceList = ref<{ id: number; name: string }[]>([]);
const localidadList = ref<{ id: number; name: string }[]>([]);

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
      genderValue.value = profDet.data.gender || undefined;
      docNumValue.value = profDet.data.docNumber || undefined;
      birthDateValue.value = profDet.data.dateBirth
        ? new Date(profDet.data.dateBirth).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      profileDetails.internalNum = profDet.data.internalNum || undefined;

      dirStreetValue.value = profDet.data.direction || undefined;
      dirNumValue.value = profDet.data.dirNumber || undefined;
      dirFloorValue.value = profDet.data.dirFloor || undefined;
      dirDptoValue.value = profDet.data.dirDpto || undefined;
      locSelecValue.value = profDet.data.locality || undefined;
      lastSelected.value = profDet.data.locality || '';
      provSelecValue.value = profDet.data.province || 0;

      phoneCellValue.value = profDet.data.cellPhone || undefined;
      phoneHomeValue.value = profDet.data.homePhone || undefined;
    } else {
      toast.error(t('ProfileView.LoadErrorMsg'));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  configStore.deactivateSpinner();
});

const selectLocality = async (option: { id: number; name: string }) => {
  locSelecValue.value = option.name;
  localitySelected.value = option.id;
  localidadList.value = [];
  lastSelected.value = option.name;
};

const profileFormEval = yup.object({
  fullName: yup.string().required(),
  gender: yup.number().required().min(1, 'Seleccione un genero'),
  docNumber: yup.number().required(),
  dateBirth: yup.date().required(),
  homePhone: yup.string().required(),
  cellPhone: yup.string().required(),
  direction: yup.string().required(),
  dirNumber: yup.string().required(),
  dirFloor: yup.string().required(),
  dirDpto: yup.string().required(),
  province: yup.number().required().min(1, 'Seleccione una provincia'),
});

const { handleSubmit } = useForm({
  validationSchema: profileFormEval,
  initialValues: {
    fullName: undefined as string | undefined,
    gender: undefined as number | undefined,
    docNumber: undefined as number | undefined,
    dateBirth: undefined as string | undefined,
    cellPhone: undefined as string | undefined,
    homePhone: undefined as string | undefined,
    direction: undefined as string | undefined,
    dirNumber: undefined as string | undefined,
    dirFloor: undefined as string | undefined,
    dirDpto: undefined as string | undefined,
    province: undefined as number | undefined,
    locality: undefined as string | undefined,
  },
});

const {
  value: fullNameValue,
  errorMessage: fullNameError,
  handleBlur: fullNameBlur,
} = useField('fullName');

const {
  value: genderValue,
  errorMessage: genderError,
  handleBlur: genderBlur,
} = useField('gender');

const {
  value: docNumValue,
  errorMessage: docNumError,
  handleBlur: docNumBlur,
} = useField('docNumber');

const {
  value: birthDateValue,
  errorMessage: birthDateError,
  handleBlur: birthDateBlur,
} = useField('dateBirth');

const {
  value: phoneHomeValue,
  errorMessage: phoneHomeError,
  handleBlur: phoneHomeBlur,
} = useField('homePhone');

const {
  value: phoneCellValue,
  errorMessage: phoneCellError,
  handleBlur: phoneCellBlur,
} = useField('cellPhone');

const {
  value: dirStreetValue,
  errorMessage: dirStreetError,
  handleBlur: dirStreetBlur,
} = useField('direction');

const {
  value: dirNumValue,
  errorMessage: dirNumError,
  handleBlur: dirNumBlur,
} = useField('dirNumber');

const {
  value: dirFloorValue,
  errorMessage: dirFloorError,
  handleBlur: dirFloorBlur,
} = useField('dirFloor');

const {
  value: dirDptoValue,
  errorMessage: dirDptoError,
  handleBlur: dirDptoBlur,
} = useField('dirDpto');

const {
  value: provSelecValue,
  errorMessage: provSelecError,
  handleBlur: provSelecBlur,
} = useField('province');

const {
  value: locSelecValue,
  errorMessage: locSelecError,
  handleBlur: locSelecBlur,
} = useField('locality');

const saveChanges = handleSubmit(async (values) => {
  settingStore.activeSpinner('Actualizando perfil...');

  // ver logica para guardar los cambios realizados en el perfil

  settingStore.deactivateSpinner();
});

watch(
  () => locSelecValue.value,
  async (newVal) => {
    isLoading.value = true;

    if (typeof newVal === 'string' && newVal.length > 4 && newVal !== lastSelected.value) {
      const { ok, data } = await getLocalitiesList(provSelecValue.value as number, newVal);

      if (ok && data) {
        localidadList.value = data;
      }
    } else {
      localidadList.value = [];
    }

    isLoading.value = false;
  },
);
</script>
