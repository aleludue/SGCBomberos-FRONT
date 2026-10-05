<template>
  <div class="tab-pane fade show active" id="bomb-data-tab" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column">
      <form @submit.prevent="updateBombData">
        <FormTitle :titleText="$t('FormSections.PersonalData')" />
        <div class="row mb-3">
          <FieldReadOnly :label-text="$t('FormField.FullName')" :valueText="bombDetails.fullName" />

          <FieldReadOnly :label-text="$t('FormField.Email')" :valueText="bombDetails.email" />

          <FieldReadOnly :label-text="$t('FormField.Document')" :valueText="bombDetails.document" />

          <FieldReadOnly
            :label-text="$t('FormField.BirthDate')"
            :valueText="bombDetails.dateBirth"
          />

          <FieldReadOnly
            :label-text="$t('FormField.Direction')"
            :valueText="bombDetails.direction"
          />

          <FieldReadOnly :label-text="$t('FormField.City')" :valueText="bombDetails.locality" />

          <FieldSelector
            :label-text="$t('FormField.Gender')"
            v-model:option="bombDetails.gender"
            :readonly="true"
            :options-list="genderOptions"
          />

          <FieldReadOnly
            :label-text="$t('FormField.HomePhone')"
            :valueText="bombDetails.homePhone?.toString()"
          />

          <FieldReadOnly
            :label-text="$t('FormField.CellPhone')"
            :valueText="bombDetails.cellPhone?.toString()"
          />
        </div>

        <FormTitle :titleText="$t('FormSections.InstitConfig')" />

        <FormAlert v-if="!validIntNum" :textDetail="$t('Validations.InternalNumUser')" />

        <div class="row mb-2">
          <FieldReadOnly :label-text="$t('FormField.Rank')" :valueText="bombDetails.rank" />

          <FieldDate
            :label-text="$t('FormField.EntryDate')"
            v-model:date-val="bombDetails.entryDate"
            :is-required="true"
            :max-date="new Date()"
            field-name="entryDate"
          />

          <FieldTimeAction
            :labelText="$t('FormField.InternalNum')"
            v-model="bombDetails.internalNum"
            @apply-search="changeInternalNum"
          />

          <FieldSwitch
            :labelText="$t('FormField.Driver')"
            v-model="bombDetails.isDriver"
            :textActive="$t('SelectOptions.Yes')"
            :textInactive="$t('SelectOptions.No')"
          />
        </div>

        <FormTitle titleText="Datos sistema" />
        <div class="row mb-2">
          <FieldSelector
            :label-text="$t('FormField.Role')"
            v-model:option="bombDetails.role"
            :readonly="false"
            :options-list="roleList"
            :base-option-text="$t('SelectOptions.NoRole')"
            field-name="rolSelect"
          />

          <FieldSwitch :labelText="$t('FormField.Status')" v-model="bombDetails.isActive" />
        </div>

        <div class="d-flex mt-3 mb-0 w-100 btn-responsive-wrapper">
          <BtnConfirm type="submit" size="sm" :text-detail="$t('Buttons.Save')" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { useRoute } from 'vue-router';

import FormTitle from '@/shared/components/FormTitle.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import FieldSwitch from '@/shared/components/Inputs/FieldSwitch.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldTimeAction from '@/shared/components/Inputs/FieldTimeAction.vue';
import { getRolesList } from '@/shared/services/generic.action';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { isoToLocalDate } from '@/shared/utils/genericFuntions';
import { genericOptionsList } from '@/shared/composables/genericOptionList';

import {
  getBombDetail,
  updateBomb,
  validateIntNum,
} from '@/features/bomberos/services/bomberos.action';
import type { UpdateBombRequest } from '@/features/bomberos/interfaces/bomberos.interfaces';
import FormAlert from '@/shared/components/FormAlert.vue';

const toast = useToast();
const route = useRoute();
const { t } = useI18n();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { handleSubmit, resetForm } = useForm();

const roleList = ref<{ id: string; name: string }[]>([]);
const genderOptions = genericOptionsList().genderList;
const validIntNum = ref(true);

const bombDetails = ref({
  fullName: undefined as string | undefined,
  email: undefined as string | undefined,
  internalNum: undefined as string | undefined,
  isDriver: false as boolean,
  isActive: false as boolean,
  role: undefined as string | undefined,
  rank: undefined as string | undefined,
  gender: undefined as number | undefined,
  document: undefined as string | undefined,
  dateBirth: undefined as string | undefined,
  direction: undefined as string | undefined,
  locality: undefined as string | undefined,
  cellPhone: undefined as string | undefined,
  homePhone: undefined as string | undefined,
  entryDate: undefined as Date | undefined,
});

onMounted(async () => {
  const [resRol, respBombDet] = await Promise.all([
    getRolesList(),
    getBombDetail(route.params.id as string),
  ]);

  if (resRol.ok && resRol.data) {
    roleList.value = resRol.data;
  } else {
    toast.error(t('Messages.ErrorLoading'));
    return;
  }

  if (respBombDet.ok && respBombDet.data) {
    bombDetails.value = {
      fullName: respBombDet.data.fullName,
      email: respBombDet.data.email,
      gender: respBombDet.data.gender || undefined,
      internalNum: respBombDet.data.internalNum,
      isDriver: respBombDet.data.isDriver,
      isActive: respBombDet.data.isActive,
      role: respBombDet.data.role,
      document:
        respBombDet.data.docType && respBombDet.data.docNum
          ? respBombDet.data.docType + ' - ' + respBombDet.data.docNum
          : undefined,
      dateBirth: respBombDet.data.dateBirth
        ? isoToLocalDate(respBombDet.data.dateBirth)
        : undefined,
      direction: undefined,
      locality:
        respBombDet.data.locality && respBombDet.data.province
          ? respBombDet.data.locality + ' (' + respBombDet.data.province + ')'
          : undefined,
      cellPhone: respBombDet.data.cellPhone,
      homePhone: respBombDet.data.homePhone,
      rank: respBombDet.data.rank ?? t('SelectOptions.NoRank'),
      entryDate: respBombDet.data.entryDate,
    };

    if (respBombDet.data.direction && respBombDet.data.dirNumber) {
      bombDetails.value.direction =
        respBombDet.data.direction + ' ' + respBombDet.data.dirNumber?.toString();

      if (respBombDet.data.dirFloor) {
        bombDetails.value.direction +=
          ' - ' + t('FormField.StreetFloor') + ' ' + respBombDet.data.dirFloor?.toString();
      }

      if (respBombDet.data.dirDpto) {
        bombDetails.value.direction +=
          ' - ' + t('FormField.StreetDept') + ' ' + respBombDet.data.dirDpto?.toString();
      }
    }

    resetForm();
  } else {
    toast.error(respBombDet.message || t('Messages.ErrorLoading'));
  }
  desactivateSpinner();
});

const updateBombData = handleSubmit(async () => {
  if (validIntNum.value === false) {
    toast.error(t('Validations.InternalNumUser'));
    return;
  }

  activeSpinner(t('Messages.Update'));

  const req: UpdateBombRequest = {
    roleId: bombDetails.value.role == '' ? undefined : bombDetails.value.role,
    internalNumber: Number(bombDetails.value.internalNum),
    isDriver: bombDetails.value.isDriver,
    systemAccess: bombDetails.value.isActive,
    entryDate: bombDetails.value.entryDate ?? new Date(),
  };

  const { ok, message } = await updateBomb(route.params.id as string, req);

  if (ok) {
    toast.success(message);
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});

const changeInternalNum = async () => {
  if (
    !bombDetails.value.internalNum ||
    bombDetails.value.internalNum.trim() === '' ||
    isNaN(Number(bombDetails.value.internalNum))
  ) {
    toast.error(t('Validations.InternalNumField'));
    return;
  }

  activeSpinner(t('Messages.Update'));

  const result = await validateIntNum(
    route.params.id as string,
    Number(bombDetails.value.internalNum),
  );

  validIntNum.value = result.ok;

  desactivateSpinner();
};
</script>
