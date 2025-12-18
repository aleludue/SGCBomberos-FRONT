<template>
  <div class="container">
    <SectionTitle title="Ajustes" subtitle="Realizar ajustes generales a todo el sistema" />

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
              Modo de color
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
                  name="listGroupRadio"
                  value="default"
                  id="sistemRadio"
                  v-model="selectMode"
                />
                <label class="ms-1 form-check-label" for="sistemRadio">
                  Misma configuración del sistema
                </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input me-1"
                  type="radio"
                  name="listGroupRadio"
                  value="dark"
                  id="darkRadio"
                  v-model="selectMode"
                />
                <label class="ms-1 form-check-label" for="darkRadio"> Modo Oscuro </label>
              </div>

              <div class="form-check">
                <input
                  class="form-check-input me-1"
                  type="radio"
                  name="listGroupRadio"
                  value="light"
                  id="lightRadio"
                  v-model="selectMode"
                />
                <label class="ms-1 form-check-label" for="lightRadio"> Modo Claro</label>
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
              Idioma
            </button>
          </h2>
          <div
            id="flush-collapseLanguage"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionSettings"
          >
            <div class="accordion-body">Selector de idiomas</div>
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

const configStore = useSiteConfigStore();

const selectMode = ref('default');

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
</script>
