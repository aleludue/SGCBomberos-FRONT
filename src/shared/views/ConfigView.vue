<template>
  <title>{{ $t('ConfigView.ViewTitle') }}</title>

  <div class="container">
    <SectionTitle
      :title="$t('ConfigView.Title')"
      :subtitle="$t('ConfigView.Subtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('ConfigView.Title') }]"
    />

    <div class="col-12 mt-3">
      <div class="accordion accordion-flush" id="accordionSettings">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseColorMode"
              aria-expanded="true"
              aria-controls="flush-collapseColorMode"
            >
              {{ $t('ConfigView.ColorMode') }}
            </button>
          </h2>
          <div
            id="flush-collapseColorMode"
            class="accordion-collapse collapse show"
            data-bs-parent="#accordionSettings"
          >
            <div class="accordion-body">
              <div class="form-check">
                <input
                  class="form-check-input me-1"
                  type="radio"
                  name="colorRadios"
                  value="default"
                  id="sistemRadio"
                  v-model="selectMode"
                />
                <label class="ms-1 form-check-label" for="sistemRadio">
                  {{ $t('ConfigView.ColorModeDefault') }}
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input me-1"
                  type="radio"
                  name="colorRadios"
                  value="dark"
                  id="darkRadio"
                  v-model="selectMode"
                />
                <label class="ms-1 form-check-label" for="darkRadio">
                  {{ $t('ConfigView.ColorModeDark') }}
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input me-1"
                  type="radio"
                  name="colorRadios"
                  value="light"
                  id="lightRadio"
                  v-model="selectMode"
                />
                <label class="ms-1 form-check-label" for="lightRadio">
                  {{ $t('ConfigView.ColorModeLight') }}</label
                >
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseLanguage"
              aria-expanded="false"
              aria-controls="flush-collapseLanguage"
            >
              {{ $t('ConfigView.Language') }}
            </button>
          </h2>
          <div
            id="flush-collapseLanguage"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionSettings"
          >
            <div class="accordion-body">
              <div class="form-check">
                <input
                  class="form-check-input me-1"
                  type="radio"
                  name="languageRadios"
                  value="es"
                  id="esRadio"
                  v-model="selectLanguage"
                />
                <label class="ms-1 form-check-label" for="esRadio">
                  {{ $t('ConfigView.LanguageSpanish') }}
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input me-1"
                  type="radio"
                  name="languageRadios"
                  value="en"
                  id="enRadio"
                  v-model="selectLanguage"
                />
                <label class="ms-1 form-check-label" for="enRadio">
                  {{ $t('ConfigView.LanguageEnglish') }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-3 text-center">
      <button class="btn btn-primary" @click="saveConfigs()">
        <i class="bi bi-floppy-fill"></i> {{ $t('GenericBtn.BtnSave') }}
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

const selectMode = ref('' as 'default' | 'dark' | 'light');
const selectLanguage = ref('' as 'es' | 'en');

onMounted(async () => {
  configStore.activeSpinner(t('ConfigView.LoadSpinMsg'));

  try {
    const serviceConfig = await getSettingAction();

    if (serviceConfig.ok) {
      selectMode.value = configStore.configs.siteColorMode;
      selectLanguage.value = configStore.configs.siteLanguage;
    } else {
      toast.error(t('ConfigView.LoadErrorMsg'));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  configStore.deactivateSpinner();
});

const saveConfigs = async () => {
  configStore.activeSpinner(t('ConfigView.SaveSpinMsg'));

  try {
    const serviceConfig = await saveSettingAction(selectMode.value, selectLanguage.value);

    if (serviceConfig.ok) {
      await configStore.setUserSettings({
        siteColorMode: selectMode.value,
        siteLanguage: selectLanguage.value,
      });

      toast.success(t('ConfigView.SaveSuccessMsg'));
    } else {
      toast.error(t('ConfigView.SaveErrorMsg'));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  configStore.deactivateSpinner();
};
</script>
