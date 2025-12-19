<template>
  <title>{{ $t('ConfigView.ViewTitle') }}</title>
  <div class="container">
    <SectionTitle :title="$t('ConfigView.Title')" :subtitle="$t('ConfigView.Subtitle')" />

    <div class="col-12 mt-3">
      <div class="accordion accordion-flush" id="accordionSettings">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseColorMode"
              aria-expanded="false"
              aria-controls="flush-collapseColorMode"
            >
              {{ $t('ConfigView.ColorMode') }}
            </button>
          </h2>
          <div
            id="flush-collapseColorMode"
            class="accordion-collapse collapse"
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

    <BtnBack />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '../stores/config.store';
import { useI18n } from 'vue-i18n';

const configStore = useSiteConfigStore();
const { locale } = useI18n();

const selectMode = ref('default');
const selectLanguage = ref('es');

onMounted(() => {
  // recuprar todas las cofiguraciones
});

watch(selectMode, (newMode) => {
  if (newMode === 'dark') {
    configStore.darkMode();
  } else if (newMode === 'light') {
    configStore.lightMode();
  } else {
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? configStore.darkMode()
      : configStore.lightMode();
  }
});

watch(selectLanguage, (newLang) => {
  locale.value = newLang;
});
</script>
