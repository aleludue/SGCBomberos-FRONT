<template>
  <div class="container">
    <SectionTitle
      :title="$t('ConfigView.Title')"
      :subtitle="$t('ConfigView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('ConfigView.Title') }]"
    />

    <div class="col-12 mt-3">
      <div class="accordion accordion-flush" id="accordionSettings">
        <!-- Sección: Modo de Color -->
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseColor"
            >
              <i class="bi bi-palette me-2"></i> {{ $t('ConfigView.ColorMode') }}
            </button>
          </h2>
          <div
            id="collapseColor"
            class="accordion-collapse collapse show"
            data-bs-parent="#accordionSettings"
          >
            <div class="accordion-body">
              <div v-for="mode in colorOptions" :key="mode.id" class="form-check mb-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="colorMode"
                  :id="mode.id"
                  :value="mode.value"
                  v-model="selectMode"
                />
                <label class="form-check-label ms-2" :for="mode.id">{{ $t(mode.label) }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Idioma -->
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseLang"
            >
              <i class="bi bi-translate me-2"></i> {{ $t('ConfigView.Language') }}
            </button>
          </h2>
          <div
            id="collapseLang"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionSettings"
          >
            <div class="accordion-body">
              <div v-for="lang in langOptions" :key="lang.id" class="form-check mb-2">
                <input
                  class="form-check-input"
                  type="radio"
                  name="langMode"
                  :id="lang.id"
                  :value="lang.value"
                  v-model="selectLanguage"
                />
                <label class="form-check-label ms-2" :for="lang.id">{{ $t(lang.label) }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 text-center">
      <button class="btn btn-success px-4" @click="saveConfigs()">
        <i class="bi bi-check-lg me-1"></i> {{ $t('GenericBtn.BtnSave') }}
      </button>
    </div>

    <BtnBack :toHome="true" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getSettingAction, saveSettingAction } from '@/features/account/services';

const configStore = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();

const selectMode = ref(configStore.configs.siteColorMode);
const selectLanguage = ref(configStore.configs.siteLanguage);

const colorOptions = [
  { id: 'radioDefault', value: 'default', label: 'ConfigView.ColorModeDefault' },
  { id: 'radioDark', value: 'dark', label: 'ConfigView.ColorModeDark' },
  { id: 'radioLight', value: 'light', label: 'ConfigView.ColorModeLight' },
] as const;

const langOptions = [
  { id: 'radioEs', value: 'es', label: 'ConfigView.LanguageSpanish' },
  { id: 'radioEn', value: 'en', label: 'ConfigView.LanguageEnglish' },
] as const;

onMounted(async () => {
  configStore.activeSpinner(t('ConfigView.LoadSpinMsg'));

  try {
    const { ok, message } = await getSettingAction();

    if (ok) {
      selectMode.value = configStore.configs.siteColorMode;
      selectLanguage.value = configStore.configs.siteLanguage;
    } else {
      toast.error(message || t('ConfigView.LoadErrorMsg'));
    }
  } catch (e) {
    toast.error(t('GenericTexts.BaseErrorMsg'));
  } finally {
    configStore.deactivateSpinner();
  }
});

const saveConfigs = async () => {
  configStore.activeSpinner(t('ConfigView.SaveSpinMsg'));

  try {
    const { ok, message } = await saveSettingAction(selectMode.value, selectLanguage.value);

    if (ok) {
      configStore.setUserSettings({
        siteColorMode: selectMode.value,
        siteLanguage: selectLanguage.value,
      });
      toast.success(t('ConfigView.SaveSuccessMsg'));
    } else {
      toast.error(message || t('ConfigView.SaveErrorMsg'));
    }
  } catch (e) {
    toast.error(t('GenericTexts.BaseErrorMsg'));
  } finally {
    configStore.deactivateSpinner();
  }
};
</script>
