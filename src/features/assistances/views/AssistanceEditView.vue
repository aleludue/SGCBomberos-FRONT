<template>
  <div class="container">
    <SectionTitle
      :title="t('AssistanceViews.EditTitle')"
      :subtitle="t('AssistanceViews.EditSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: t('AssistanceViews.MenuTitle'), link: '/assistances' },
        { detail: $t('AssistanceViews.ConsultTitle'), link: '/assistances/consult' },
        { detail: t('AssistanceViews.EditTitle') },
      ]"
    />

    <div class="d-flex flex-column">
      <form @submit.prevent="editAssistData">
        <FormTitle :titleText="$t('FormSections.BaseData')" />
        <div class="row mb-3">
          <FieldSelector
            :readonly="true"
            :label-text="$t('FormField.AssistType')"
            v-model:option="assistDetails.typeId"
            :options-list="typeList"
            field-name="typeId"
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
                v-model="assistDetails.bombSelec"
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
                v-model="assistDetails.bombSelec"
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
import { useRoute } from 'vue-router';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';

import { getBombInService, getBombInTurn } from '@/features/bomberos/services/bomberos.action';
import {
  getAssistDetail,
  updateAssistance,
} from '@/features/assistances/services/assistances.action';
import type { AssistanceEditSave } from '@/features/assistances/interfaces/assistances.interfaces';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { t } = useI18n();
const { handleSubmit } = useForm();
const toast = useToast();
const route = useRoute();

const typeList = ref<{ id: string; name: string }[]>([]);
const bombList = ref<{ id: string; name: string }[]>([]);
const bombTurnList = ref<{ id: string; name: string }[]>([]);
const needTimeReg = ref<boolean>(false);

const assistDetails = ref({
  typeId: '' as string | undefined,
  startAt: undefined as Date | undefined,
  endAt: undefined as Date | undefined,
  details: undefined as string | undefined,
  bombSelec: [] as string[],
});

onMounted(async () => {
  const [resBombList, respBombTurn, resAssistDet] = await Promise.all([
    getBombInService(),
    getBombInTurn(),
    getAssistDetail(route.params.id as string),
  ]);

  if (
    resBombList.ok &&
    resBombList.data &&
    respBombTurn.ok &&
    respBombTurn.data &&
    resAssistDet.ok &&
    resAssistDet.data
  ) {
    typeList.value = [{ id: resAssistDet.data.typeId, name: resAssistDet.data.typeName }];
    needTimeReg.value = resAssistDet.data.registerTime;

    if (resAssistDet.data.forTurn) {
      bombTurnList.value = respBombTurn.data.map((bomb) => ({
        id: bomb.id,
        name: bomb.internalNum + ' - ' + bomb.fullName,
      }));

      resBombList.data.forEach((bomb) => {
        if (!bombTurnList.value.some((bt) => bt.id === bomb.id)) {
          bombList.value.push({
            id: bomb.id,
            name: bomb.internalNum + ' - ' + bomb.fullName,
          });
        }
      });
    } else {
      bombTurnList.value = [];
      bombList.value = resBombList.data.map((bomb) => ({
        id: bomb.id,
        name: bomb.internalNum + ' - ' + bomb.fullName,
      }));
    }

    assistDetails.value = {
      typeId: resAssistDet.data.typeId,
      startAt: new Date(resAssistDet.data.startAt),
      endAt: resAssistDet.data.endAt ? new Date(resAssistDet.data.endAt) : undefined,
      details: resAssistDet.data.details,
      bombSelec: resAssistDet.data.bombList,
    };
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }

  desactivateSpinner();
});

const editAssistData = handleSubmit(async (values) => {
  if (assistDetails.value.bombSelec.length == 0) {
    toast.error(t('Validations.NoSelected'));
    return;
  }

  activeSpinner(t('Messages.Update'));

  const req: AssistanceEditSave = {
    startAt: values.startAt,
    endAt: values.endAt,
    details: values.details,
    bombList: assistDetails.value.bombSelec,
  };

  const { ok, message } = await updateAssistance(route.params.id as string, req);

  if (ok) {
    toast.success(message);
  } else {
    toast.error(message ?? t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});
</script>
