<template>
  <div class="container">
    <SectionTitle
      :title="$t('TurnsViews.NewTitle')"
      :subtitle="$t('TurnsViews.NewSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('TurnsViews.MenuTitle'), link: '/turns' },
        { detail: $t('TurnsViews.NewTitle') },
      ]"
    />

    <div class="d-flex flex-column">
      <form @submit.prevent="saveNewTurn">
        <FormTitle :titleText="$t('FormSections.BaseData')" />
        <div class="row mb-3">
          <FieldText
            :label-text="t('FormField.Name')"
            field-name="name"
            v-model:text-det="turnDetails.name"
            :is-required="true"
            :max-length="100"
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
import { useForm } from 'vee-validate';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { saveTurn } from '@/features/turns/services/turns.action';
import type { SaveTurn } from '@/features/turns/interfaces/turns.interfaces';
import { getBombInService } from '@/features/bomberos/services/bomberos.action';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { handleSubmit } = useForm();
const toast = useToast();
const { t } = useI18n();
const router = useRouter();

const turnDetails = ref({
  name: undefined as string | undefined,
  description: undefined as string | undefined,
  bombSelec: [] as string[],
});

const bombList = ref<{ id: string; name: string }[]>([]);

onMounted(async () => {
  const { ok, data } = await getBombInService();

  if (ok && data) {
    data.forEach((bomb) => {
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

const saveNewTurn = handleSubmit(async (values) => {
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

  const { ok, message } = await saveTurn(req);

  if (ok) {
    toast.success(message);
    await router.push(`/turns/consult`);
  } else {
    toast.error(message ?? t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});
</script>
