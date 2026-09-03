<template>
  <div class="container">
    <SectionTitle
      :title="t('BomberosViews.AddTitle')"
      :subtitle="t('BomberosViews.AddSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('BomberosViews.MenuTitle'), link: '/bomberos' },
        { detail: t('BomberosViews.AddTitle') },
      ]"
    />

    <div class="d-flex flex-column">
      <form @submit.prevent="saveBombData">
        <FormTitle :titleText="$t('FormSections.BaseData')" />
        <div class="row mb-3">
          <FieldText
            :label-text="$t('FormField.FullName')"
            field-name="fullName"
            :is-required="true"
            :max-length="100"
            v-model:text-det="bombDetails.fullName"
          />

          <FieldEmail
            v-model:email="bombDetails.email"
            :label-text="$t('FormField.Email')"
            :is-login-form="false"
            :is-required="true"
            field-name="email"
          />
        </div>

        <FormTitle :titleText="$t('FormSections.InstitConfig')" />
        <div class="row mb-3">
          <FieldNumber
            :label-text="$t('FormField.InternalNum')"
            v-model:num-val="bombDetails.internalNum"
            field-name="internalNum"
            :is-required="false"
          />

          <FieldSelector
            :label-text="$t('FormField.Role')"
            v-model:option="bombDetails.roleId"
            :readonly="false"
            :options-list="roleList"
            :base-option-text="$t('SelectOptions.NoRole')"
            field-name="rolSelect"
          />

          <FieldSelector
            :label-text="$t('FormField.Rank')"
            v-model:option="bombDetails.rankId"
            :readonly="false"
            :options-list="rankList"
            :base-option-text="$t('SelectOptions.NoRank')"
            field-name="rankSelect"
          />

          <FieldDate
            :label-text="$t('BomberosViews.ServiceHistoryStart')"
            v-model:date-val="bombDetails.serviceStart"
            :max-date="new Date()"
            field-name="serviceStart"
          />

          <FieldSwitch
            :labelText="$t('FormField.Driver')"
            v-model="bombDetails.isDriver"
            :textActive="$t('SelectOptions.Yes')"
            :textInactive="$t('SelectOptions.No')"
          />
        </div>

        <div class="d-flex mt-3 mb-0 w-100 btn-responsive-wrapper">
          <BtnConfirm type="submit" size="sm" :text-detail="$t('Buttons.Save')" />
        </div>
      </form>
    </div>

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getRolesList } from '@/shared/services/generic.action';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldEmail from '@/shared/components/Inputs/FieldEmail.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import FieldSwitch from '@/shared/components/Inputs/FieldSwitch.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import { getRanks } from '@/features/institution/services/institution.action';
import { saveNewBomb } from '@/features/bomberos/services/bomberos.action';
import type { SaveBombRequest } from '@/features/bomberos/interfaces/bomberos.interfaces';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const { handleSubmit } = useForm();
const toast = useToast();
const router = useRouter();

const roleList = ref<{ id: number; name: string }[]>([]);
const rankList = ref<{ id: number; name: string }[]>([]);

const bombDetails = ref({
  fullName: undefined as string | undefined,
  email: undefined as string | undefined,
  roleId: 0 as number,
  rankId: 0 as number,
  internalNum: undefined as number | undefined,
  isDriver: false as boolean,
  serviceStart: undefined as Date | undefined,
});

onMounted(async () => {
  const [resRol, resRanks] = await Promise.all([getRolesList(), getRanks()]);

  if (resRol.ok && resRol.data && resRanks.ok && resRanks.data) {
    roleList.value = resRol.data;
    rankList.value = resRanks.data;
  } else {
    toast.error(t('Messages.ErrorLoading'));
    return;
  }

  desactivateSpinner();
});

const saveBombData = handleSubmit(async (values) => {
  activeSpinner(t('Messages.Update'));

  const req: SaveBombRequest = {
    fullName: values.fullName,
    email: values.email,
    isDriver: bombDetails.value.isDriver,
    roleId: values.rolSelect,
    rankId: values.rankSelect,
    internalNum: values.internalNum,
    serviceStart: values.serviceStart,
  };

  const { ok, message } = await saveNewBomb(req);

  if (ok) {
    toast.success(message);
    await router.push(`/bomberos/consult`);
  } else {
    toast.error(message ?? t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});
</script>
