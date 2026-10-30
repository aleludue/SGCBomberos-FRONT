<template>
  <div class="container">
    <SectionTitle
      :title="$t('TurnsViews.EditTitle')"
      :subtitle="$t('TurnsViews.EditSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('TurnsViews.MenuTitle'), link: '/turns' },
        { detail: $t('TurnsViews.ConsultTitle'), link: '/turns/consult' },
        { detail: $t('TurnsViews.EditTitle') },
      ]"
    />

    <div class="d-flex flex-column">
      <form @submit.prevent="saveEditTurn">
        <FormTitle :titleText="$t('FormSections.BaseData')" />
        <div class="row mb-3">
          <FieldText
            :label-text="t('FormField.Name')"
            field-name="name"
            v-model:text-det="turnDetails.name"
            :is-required="true"
            :max-length="100"
          />

          <FieldReadOnly
            :label-text="t('FormField.Order')"
            :value-text="turnDetails.rotationOrder"
          />

          <FieldText
            :label-text="t('FormField.Description')"
            field-name="description"
            :is-textarea="true"
            v-model:text-det="turnDetails.description"
            :is-required="false"
            :max-length="250"
            :is-login-form="true"
          />
        </div>

        <FormTitle :titleText="$t('FormSections.ActiveFirefighters')" />
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
                v-model="turnDetails.bombSelec"
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
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { getBombInService } from '@/features/bomberos/services/bomberos.action';
import { editTurn, getTurnDetail } from '@/features/turns/services/turns.action';
import FieldReadOnly from '@/shared/components/Inputs/FieldReadOnly.vue';
import type { SaveTurn } from '../interfaces/turns.interfaces';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const { handleSubmit } = useForm();

const turnDetails = ref({
  name: undefined as string | undefined,
  description: undefined as string | undefined,
  rotationOrder: undefined as string | undefined,
  bombSelec: [] as string[],
});

const bombList = ref<{ id: string; name: string }[]>([]);

onMounted(async () => {
  const [respBombList, respTurnDet] = await Promise.all([
    getBombInService(),
    getTurnDetail(route.params.id as string),
  ]);

  if (respBombList.ok && respBombList.data && respTurnDet.ok && respTurnDet.data) {
    respBombList.data.forEach((bomb) => {
      bombList.value.push({
        id: bomb.id,
        name: bomb.internalNum + ' - ' + bomb.fullName,
      });
    });

    turnDetails.value.name = respTurnDet.data.name;
    turnDetails.value.description = respTurnDet.data.description;
    turnDetails.value.rotationOrder = respTurnDet.data.rotationOrder.toString();
    turnDetails.value.bombSelec = respTurnDet.data.bomberos;
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }

  if (respTurnDet.ok && respTurnDet.data) desactivateSpinner();
});

const saveEditTurn = handleSubmit(async (values) => {
  if (turnDetails.value.bombSelec.length == 0) {
    toast.error(t('Validations.NoSelected'));
    return;
  }

  activeSpinner(t('Messages.Update'));

  const req: SaveTurn = {
    name: values.name,
    description: values.description,
    bomberos: turnDetails.value.bombSelec,
  };

  const { ok, message } = await editTurn(route.params.id as string, req);

  if (ok) {
    toast.success(message);
  } else {
    toast.error(message ?? t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});
</script>
