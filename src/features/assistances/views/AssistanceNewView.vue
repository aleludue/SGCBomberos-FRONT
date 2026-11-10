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
            v-if="!needTimeReg"
            :label-text="$t('FormField.Date')"
            v-model:date-val="assistDetails.startAt"
            :is-required="true"
            :max-date="new Date()"
            field-name="startAt"
          />

          <FieldDate
            v-if="needTimeReg"
            :label-text="$t('FormField.AssistStart')"
            v-model:date-val="assistDetails.startAt"
            :is-required="true"
            :max-date="assistDetails.endAt"
            field-name="startAt"
            :include-time="true"
          />

          <FieldDate
            v-if="needTimeReg"
            :label-text="$t('FormField.AssistEnd')"
            v-model:date-val="assistDetails.endAt"
            :is-required="true"
            :max-date="new Date()"
            field-name="endAt"
            :include-time="true"
          />

          <FieldText
            :label-text="t('FormField.Description')"
            field-name="details"
            :is-textarea="true"
            v-model:text-det="assistDetails.details"
            :is-required="false"
            :max-length="250"
            :is-login-form="true"
          />
        </div>

        <FormTitle v-if="bombTurnList.length > 0" :titleText="$t('FormSections.BombTurn')" />
        <div v-if="bombTurnList.length > 0" class="row mb-4">
          <div
            class="btn-group d-flex flex-wrap gap-2 mt-2"
            role="group"
            aria-label="checkbox toggle button group"
          >
            <div v-for="bombe in bombTurnList" :key="bombe.id">
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

        <FormTitle v-if="bombList.length > 0" :titleText="$t('FormSections.BombAssist')" />
        <div v-if="bombList.length > 0" class="row mb-4">
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
import { onMounted, ref, watch } from 'vue';
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
import { getBombInService, getBombInTurn } from '@/features/bomberos/services/bomberos.action';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const { handleSubmit } = useForm();
const toast = useToast();
const router = useRouter();

const typeList = ref<{ id: string; name: string }[]>([]);
const typeReqTurnList = ref<string[]>([]);
const typeReqTimeList = ref<string[]>([]);

const bombList = ref<{ id: string; name: string }[]>([]);
const bombTurnList = ref<{ id: string; name: string }[]>([]);

const bombInServiceList = ref<{ id: string; name: string }[]>([]);
const bombInTurnList = ref<{ id: string; name: string }[]>([]);

const bombSelec = ref<string[]>([]);
const needTimeReg = ref<boolean>(false);

const assistDetails = ref({
  typeId: '' as string | undefined,
  startAt: undefined as Date | undefined,
  endAt: undefined as Date | undefined,
  details: undefined as string | undefined,
});

onMounted(async () => {
  const [resAssitType, resBombList, respBombTurn] = await Promise.all([
    getAssistTypes(),
    getBombInService(),
    getBombInTurn(),
  ]);

  if (
    resAssitType.ok &&
    resAssitType.data &&
    resBombList.ok &&
    resBombList.data &&
    respBombTurn.ok &&
    respBombTurn.data
  ) {
    typeList.value = resAssitType.data.map((type) => ({
      id: type.id,
      name: type.name,
    }));

    resAssitType.data.forEach((type) => {
      if (type.forTurn) {
        typeReqTurnList.value.push(type.id);
      }

      if (type.registerTime) {
        typeReqTimeList.value.push(type.id);
      }
    });

    bombInServiceList.value = resBombList.data.map((bomb) => ({
      id: bomb.id,
      name: bomb.internalNum + ' - ' + bomb.fullName,
    }));

    bombInTurnList.value = respBombTurn.data.map((bomb) => ({
      id: bomb.id,
      name: bomb.internalNum + ' - ' + bomb.fullName,
    }));
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

watch(
  () => assistDetails.value.typeId,
  async (newVal) => {
    bombTurnList.value = [];
    bombList.value = [];
    bombSelec.value = [];

    if (!newVal || newVal === '') return;

    if (typeReqTurnList.value.includes(newVal)) {
      bombTurnList.value = bombInTurnList.value;
      bombList.value = bombInServiceList.value.filter(
        (bomb) => !bombInTurnList.value.some((bt) => bt.id === bomb.id),
      );
    } else {
      bombTurnList.value = [];
      bombList.value = bombInServiceList.value;
    }

    needTimeReg.value = typeReqTimeList.value.includes(newVal);
  },
);
</script>
