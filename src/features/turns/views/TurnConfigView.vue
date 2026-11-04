<template>
  <div class="container">
    <SectionTitle
      :title="$t('TurnsViews.ConfigTitle')"
      :subtitle="$t('TurnsViews.ConfigSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[
        { detail: $t('TurnsViews.MenuTitle'), link: '/turns' },
        { detail: $t('TurnsViews.ConfigTitle') },
      ]"
    />

    <div class="d-flex flex-column">
      <form @submit.prevent="saveConfigTurn">
        <FormTitle :titleText="$t('FormSections.BaseData')" />
        <div class="row mb-3">
          <FieldDate
            :label-text="$t('FormField.DateFrom')"
            v-model:date-val="configDet.startDate"
            :is-required="true"
            :max-date="new Date()"
            field-name="startDate"
          />

          <FieldNumber
            :label-text="$t('FormField.Duration')"
            v-model:num-val="configDet.durationDays"
            field-name="durationDays"
            :is-required="true"
          />
        </div>

        <FormTitle :titleText="$t('FormSections.TurnOrder')" />
        <div class="custom-turn-container mb-4">
          <ul class="list-group list-custom-turns" ref="turnsListRef">
            <li
              v-for="turno in configDet.turnList"
              :key="turno.id"
              :data-id="turno.id"
              class="list-group-item d-flex justify-content-between align-items-center turn-item-card"
            >
              <div class="d-flex align-items-center">
                <i class="bi bi-grip-vertical drag-handle fs-4 me-3"></i>
                <div>
                  <span class="turn-name">{{ turno.name }}</span>
                </div>
              </div>
              <span class="badge badge-turn-order px-3 py-2 fs-6 rounded-pill">
                #{{ turno.rotationOrder }}
              </span>
            </li>
          </ul>

          <div v-if="configDet.turnList.length === 0" class="text-center text-muted my-4">
            {{ $t('Validations.TurnListEmpty') }}
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
import { nextTick, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import Sortable from 'sortablejs';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import FormTitle from '@/shared/components/FormTitle.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldDate from '@/shared/components/Inputs/FieldDate.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { editTurnConfig, getTurnConfig } from '@/features/turns/services/turns.action';
import type { EditTurnConfig, TurnDet } from '@/features/turns/interfaces/turns.interfaces';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();
const { handleSubmit } = useForm();

const turnsListRef = ref<HTMLElement | null>(null);

const configDet = ref({
  startDate: undefined as Date | undefined,
  durationDays: undefined as number | undefined,
  turnList: [] as TurnDet[],
});

onMounted(async () => {
  const { ok, data } = await getTurnConfig();

  if (ok) {
    configDet.value.startDate = data?.startDate ?? undefined;
    configDet.value.durationDays = data?.durationDays ?? undefined;

    const sortedTurns = (data?.turnos || []) as TurnDet[];
    sortedTurns.sort((a, b) => a.rotationOrder - b.rotationOrder);
    sortedTurns.forEach((turno, index) => {
      turno.rotationOrder = index + 1;
    });

    configDet.value.turnList = sortedTurns;

    await nextTick();
    initSortable();
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }
  desactivateSpinner();
});

const initSortable = () => {
  if (!turnsListRef.value) return;

  Sortable.create(turnsListRef.value, {
    animation: 180,
    handle: '.drag-handle',
    ghostClass: 'turn-ghost-item',
    onEnd: (evt) => {
      const { oldIndex, newIndex } = evt;
      if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;

      const movedItem = configDet.value.turnList.splice(oldIndex, 1)[0];
      configDet.value.turnList.splice(newIndex, 0, movedItem);

      configDet.value.turnList.forEach((turno, index) => {
        turno.rotationOrder = index + 1;
      });
    },
  });
};

const saveConfigTurn = handleSubmit(async (values) => {
  if (configDet.value.turnList.length == 0) {
    toast.error(t('Validations.TurnListEmpty'));
    return;
  }

  activeSpinner(t('Messages.Update'));

  const request: EditTurnConfig = {
    startDate: values.startDate,
    durationDays: values.durationDays,
    turnos: configDet.value.turnList
      .sort((a, b) => a.rotationOrder - b.rotationOrder)
      .map((turno) => turno.id),
  };

  const { ok, message } = await editTurnConfig(request);

  if (ok) {
    toast.success(message);
  } else {
    toast.error(message ?? t('Messages.ErrorUpdate'));
  }
  desactivateSpinner();
});
</script>

<style scoped>
.custom-turn-container {
  border: 1px solid var(--bs-border-color);
  border-radius: 6px;
  padding: 1.25rem;
  background-color: transparent;
}

.list-custom-turns {
  background: transparent;
  padding: 0;
  margin: 0;
}

.turn-item-card {
  background-color: var(--bs-card-bg);
  border: 1px solid var(--bs-border-color) !important;
  border-radius: 6px !important;
  color: var(--bs-body-color);
  margin-bottom: 0.75rem;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.turn-item-card:last-child {
  margin-bottom: 0 !important;
}

.turn-item-card:hover {
  background-color: var(--bs-secondary-bg);
  border-color: var(--brand-primary) !important;
}

.turn-name {
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.drag-handle {
  color: var(--bs-secondary-color);
  cursor: grab;
  transition: color 0.15s ease;
}

.turn-item-card:hover .drag-handle {
  color: var(--bs-body-color);
}

.drag-handle:active {
  cursor: grabbing;
}

.badge-turn-order {
  background-color: var(--brand-primary);
  color: var(--bs-on-brand-color);
  font-weight: 700;
  min-width: 45px;
  text-align: center;
}

:deep(.turn-ghost-item) {
  opacity: 0.45;
  background-color: var(--bs-secondary-bg) !important;
  border: 1px dashed var(--brand-primary) !important;
}
</style>
