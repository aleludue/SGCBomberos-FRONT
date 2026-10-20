<template>
  <div class="container">
    <SectionTitle
      :title="t('AssistanceViews.NewTitle')"
      :subtitle="t('AssistanceViews.NewSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('AssistanceViews.MenuTitle'), link: '/assistances' },
        { detail: t('AssistanceViews.NewTitle') },
      ]"
    />

    <div class="d-flex flex-column">
      <form @submit.prevent="saveAssistData">
        <FormTitle :titleText="$t('FormSections.BaseData')" />
        <div class="row mb-3">
          <FieldSelector
            :label-text="$t('FormField.AssistType')"
            v-model:option="assistDetails.typeId"
            :options-list="typeList"
            field-name="typeId"
            :is-required="true"
          />

          <FieldDate
            :label-text="$t('FormField.AssistStart')"
            v-model:date-val="assistDetails.startAt"
            :is-required="true"
            :max-date="assistDetails.endAt"
            field-name="startAt"
            :include-time="true"
          />

          <FieldDate
            :label-text="$t('FormField.AssistEnd')"
            v-model:date-val="assistDetails.endAt"
            :is-required="true"
            :max-date="new Date()"
            field-name="endAt"
            :include-time="true"
          />

          <FieldText
            :label-text="t('FormField.Description')"
            field-name="modalTypeDetail"
            :is-textarea="true"
            v-model:text-det="assistDetails.details"
            :is-required="false"
            :max-length="250"
            :is-login-form="true"
          />
        </div>

        <FormTitle :titleText="$t('FormSections.BombAssist')" />
        <div class="row mb-4">
          <div
            class="btn-group d-flex flex-wrap gap-2 mt-2"
            role="group"
            aria-label="checkbox toggle button group"
          >
            <div v-for="bombe in bombList" :key="bombe.id">
              <input
                type="checkbox"
                class="btn-check"
                :id="'btncheckInterv' + bombe.id"
                :value="bombe.id"
                v-model="bombSelec"
                autocomplete="off"
              />
              <label class="btn btn-custom-fire" :for="'btncheckInterv' + bombe.id">
                {{ bombe.name }}
              </label>
            </div>
          </div>
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
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';

import { saveAssistance } from '@/features/assistances/services/assistances.action';
import type { AssistanceSave } from '@/features/assistances/interfaces/assistances.interfaces';
import { getAssistTypes } from '@/features/assistances/services/assistanceType.action';
import { getBombInService } from '@/features/bomberos/services/bomberos.action';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const { handleSubmit } = useForm();
const toast = useToast();
const router = useRouter();

const typeList = ref<{ id: string; name: string }[]>([]);
const bombList = ref<{ id: string; name: string }[]>([]);
const bombSelec = ref<string[]>([]);

const assistDetails = ref({
  typeId: '' as string | undefined,
  startAt: undefined as Date | undefined,
  endAt: undefined as Date | undefined,
  details: undefined as string | undefined,
});

onMounted(async () => {
  const [resAssitType, resBombList] = await Promise.all([getAssistTypes(), getBombInService()]);

  if (resAssitType.ok && resAssitType.data && resBombList.ok && resBombList.data) {
    typeList.value = resAssitType.data?.map((type) => ({
      id: type.id,
      name: type.name,
    }));

    resBombList.data.forEach((bomb) => {
      bombList.value.push({
        id: bomb.id,
        name: bomb.internalNum + ' - ' + bomb.fullName,
      });
    });
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }

  desactivateSpinner();
});

const saveAssistData = handleSubmit(async (values) => {
  if (bombSelec.value.length == 0) {
    toast.error(t('Validations.NoSelected'));
    return;
  }

  activeSpinner(t('Messages.Update'));

  const req: AssistanceSave = {
    typeId: values.typeId,
    startAt: values.startAt,
    endAt: values.endAt,
    details: values.details,
    bombList: bombSelec.value,
  };

  const { ok, message } = await saveAssistance(req);

  if (ok) {
    toast.success(message);
    await router.push(`/assistances/consult`);
  } else {
    toast.error(message ?? t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});
</script>
