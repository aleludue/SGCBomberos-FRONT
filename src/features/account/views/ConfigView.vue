<template>
  <div class="container">
    <SectionTitle
      :title="$t('BaseViews.ConfigTitle')"
      :subtitle="$t('BaseViews.ConfigSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('BaseViews.ConfigTitle') }]"
    />

    <div class="settings-card-container">
      <div
        class="accordion accordion-flush rounded border border-secondary-subtle overflow-hidden"
        id="accordionSettings"
      >
        <!-- Sección: Modo de Color -->
        <div class="accordion-item bg-transparent text-body border-0">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed fw-bold text-body bg-transparent py-3 px-4"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseColor"
              aria-expanded="false"
              aria-controls="collapseColor"
            >
              <i class="bi bi-palette text-orange-fire me-2"></i> {{ $t('FormField.ColorMode') }}
            </button>
          </h2>
          <div
            id="collapseColor"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionSettings"
          >
            <div class="accordion-body border-top border-secondary-subtle bg-body">
              <div
                v-for="mode in colorOptions"
                :key="mode.id"
                class="form-check mb-2 p-2 rounded-2 hover-row"
              >
                <input
                  class="form-check-input ms-0"
                  type="radio"
                  name="colorMode"
                  :id="mode.id"
                  :value="mode.value"
                  v-model="selectMode"
                />
                <label
                  class="form-check-label ms-2 cursor-pointer text-body fw-medium"
                  :for="mode.id"
                  >{{ $t(mode.label) }}</label
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Idioma -->
        <div
          class="accordion-item bg-transparent text-body border-0 border-top border-secondary-subtle"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed fw-bold text-body bg-transparent py-3 px-4"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseLang"
              aria-expanded="false"
              aria-controls="collapseLang"
            >
              <i class="bi bi-translate text-orange-fire me-2"></i> {{ $t('FormField.Language') }}
            </button>
          </h2>
          <div
            id="collapseLang"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionSettings"
          >
            <div class="accordion-body border-top border-secondary-subtle bg-body">
              <div
                v-for="lang in langOptions"
                :key="lang.id"
                class="form-check mb-2 p-2 rounded-2 hover-row"
              >
                <input
                  class="form-check-input ms-0"
                  type="radio"
                  name="langMode"
                  :id="lang.id"
                  :value="lang.value"
                  v-model="selectLanguage"
                />
                <label
                  class="form-check-label ms-2 cursor-pointer text-body fw-medium"
                  :for="lang.id"
                  >{{ $t(lang.label) }}</label
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex mt-3 mb-0 w-100 btn-responsive-wrapper">
        <BtnSubmit size="sm" class="px-5 py-2 shadow-sm fw-bold" @click="saveConfigs()">
          <i class="bi bi-check-lg me-1"></i> {{ $t('Buttons.Save') }}
        </BtnSubmit>
      </div>

      <BtnBack :toHome="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import BtnSubmit from '@/shared/components/button/BtnSubmit.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getSettingAction, saveSettingAction } from '@/features/account/services';

const configStore = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();

const selectMode = ref(configStore.configs.siteColorMode);
const selectLanguage = ref(configStore.configs.siteLanguage);

const colorOptions = [
  { id: 'radioDefault', value: 'default', label: 'SelectOptions.ModeDefault' },
  { id: 'radioDark', value: 'dark', label: 'SelectOptions.ModeDark' },
  { id: 'radioLight', value: 'light', label: 'SelectOptions.ModeLight' },
] as const;

const langOptions = [
  { id: 'radioEs', value: 'es', label: 'SelectOptions.Spanish' },
  { id: 'radioEn', value: 'en', label: 'SelectOptions.English' },
] as const;

onMounted(async () => {
  const { ok, message } = await getSettingAction();

  if (ok) {
    selectMode.value = configStore.configs.siteColorMode;
    selectLanguage.value = configStore.configs.siteLanguage;
  } else {
    toast.error(message || t('Messages.Error'));
  }

  configStore.desactivateSpinner();
});

const saveConfigs = async () => {
  configStore.activeSpinner(t('Messages.Update'));

  const { ok, message } = await saveSettingAction(selectMode.value, selectLanguage.value);

  if (ok) {
    configStore.setUserSettings({
      siteColorMode: selectMode.value,
      siteLanguage: selectLanguage.value,
    });
    toast.success(t('Messages.SuccessUpdate'));
  } else {
    toast.error(message || t('Messages.Error'));
  }

  configStore.desactivateSpinner();
};
</script>

<style scoped>
.hover-row {
  transition: background-color 0.2s ease;
}

.hover-row:hover {
  background-color: var(--bs-tertiary-bg) !important;
}

.accordion-button::after {
  filter: var(--bs-accordion-btn-icon-transform, none);
  transition: transform 0.2s ease;
}

.accordion-button:not(.collapsed)::after {
  filter: invert(53%) sepia(93%) saturate(3547%) hue-rotate(11deg) brightness(101%) contrast(106%) !important;
}

.settings-card-container :deep(.form-check-input) {
  cursor: pointer;
}

@media (max-width: 575.98px) {
  .btn-actions-row {
    flex-direction: column-reverse !important;
    gap: 1rem;
    align-items: stretch !important;
  }
  .btn-actions-row button,
  .btn-actions-row :deep(.btn-back-custom) {
    width: 100% !important;
  }
}
</style>
