<template>
  <div class="tab-pane fade" id="bomb-rank-tab" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column">
      <form @submit.prevent="addRankHistory">
        <FormTitle :titleText="t('Buttons.Add')" />

        <div class="row mb-3">
          <FieldSelector
            :label-text="$t('FormField.Rank')"
            v-model:option="rankRegDet.rankId"
            :is-required="true"
            :options-list="rankListDisp"
            :base-option-text="$t('SelectOptions.NoRank')"
            field-name="rankId"
          />

          <FieldDate
            :label-text="$t('BomberosViews.ServiceHistoryStart')"
            v-model:date-val="rankRegDet.dateStart"
            :is-required="true"
            :max-date="rankRegDet.dateDown || new Date()"
            field-name="dateStart"
          />

          <FieldDate
            :label-text="$t('BomberosViews.ServiceHistoryEnd')"
            v-model:date-val="rankRegDet.dateDown"
            :min-date="rankRegDet.dateStart"
            :max-date="new Date()"
            field-name="dateDown"
          />
        </div>

        <div class="d-flex mt-3 mb-3 w-100 btn-responsive-wrapper">
          <BtnConfirm type="submit" size="sm" icon="bi-plus" :text-detail="$t('Buttons.Add')" />
        </div>
      </form>

      <FormTitle titleText="Historial" />

      <NoRecordAlert v-if="listRankHistory?.length == 0" />
      <div class="row g-3">
        <CardDetail
          v-for="rankHist in listRankHistory"
          :key="rankHist.id"
          :title-text="rankList.find((r) => r.id === rankHist.rankId)?.name"
          :body-titles="cardRankDetail"
          :body-text="[rankHist.dateStart ?? '', rankHist.dateDown ?? '']"
          :can-edit="false"
          @close="removeReg(rankHist.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import NoRecordAlert from '@/shared/components/NoRecordAlert.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import CardDetail from '@/shared/components/CardDetail.vue';

import {
  deleteRankHistory,
  getRankHistory,
  saveRankHistory,
} from '@/features/rankHistory/services/rankHistory.action';
import type {
  RankHistoryDetail,
  SaveRankHistory,
} from '@/features/rankHistory/interfaces/rankHistory.interfaces';
import { getRanks } from '@/features/institution/services/institution.action';

const toast = useToast();
const route = useRoute();
const { t } = useI18n();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { handleSubmit, resetForm } = useForm();

const rankList = ref<{ id: string; name: string }[]>([]);
const rankListDisp = ref<{ id: string; name: string }[]>([]);
const listRankHistory = ref<RankHistoryDetail[]>([]);

const rankRegDet = ref({
  regId: '' as string | undefined,
  rankId: '' as string | undefined,
  dateStart: undefined as Date | undefined,
  dateDown: undefined as Date | undefined,
});

const cardRankDetail = [
  t('BomberosViews.ServiceHistoryStart'),
  t('BomberosViews.ServiceHistoryEnd'),
];

onMounted(async () => {
  const { ok, data } = await getRanks();

  if (ok && data) {
    rankList.value = data;
  } else {
    toast.error(t('Messages.ErrorLoading'));
    return;
  }

  await getRankDetail();
  desactivateSpinner();
});

const getRankDetail = async () => {
  const { ok, data, message } = await getRankHistory(route.params.id as string);

  if (ok && data) {
    listRankHistory.value = data;

    rankListDisp.value = rankList.value.filter(
      (rank) => !listRankHistory.value.some((hist) => hist.rankId === rank.id),
    );
  } else {
    toast.error(message || t('Messages.ErrorLoading'));
  }
};

const addRankHistory = handleSubmit(async (values) => {
  activeSpinner(t('Messages.Update'));

  const req: SaveRankHistory = {
    bombId: route.params.id as string,
    rankId: values.rankId,
    rankStart: values.dateStart,
    rankFinish: values.dateDown,
  };

  const { ok, message } = await saveRankHistory(req);

  if (ok) {
    toast.success(message);
    clearReg();
    await getRankDetail();
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});

const removeReg = async (id?: string) => {
  activeSpinner(t('Messages.Update'));

  const { ok, message } = await deleteRankHistory(id as string, route.params.id as string);

  if (ok) {
    toast.success(message);
    await getRankDetail();
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }
  desactivateSpinner();
};

const clearReg = () => {
  rankRegDet.value.regId = '';
  rankRegDet.value.rankId = '';
  rankRegDet.value.dateStart = undefined;
  rankRegDet.value.dateDown = undefined;

  resetForm();
};
</script>
