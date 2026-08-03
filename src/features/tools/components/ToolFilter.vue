<template>
  <div
    class="col-12 shadow rounded border border-secondary-subtle bg-body-tertiary mb-2 filter-card-container"
  >
    <div class="accordion accordion-flush" id="accordionFilters">
      <div class="accordion-item bg-transparent border-0">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed fw-bold bg-transparent text-body"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseFilters"
            aria-expanded="false"
            aria-controls="flush-collapseFilters"
          >
            <i class="bi bi-funnel text-orange-fire me-2"></i>
            {{ $t('FormField.Filters') }}

            <span
              v-if="activeFiltersCount > 0"
              class="badge rounded-pill bg-orange-fire text-white ms-2"
            >
              {{ activeFiltersCount }}
            </span>
          </button>
        </h2>
        <div
          id="flush-collapseFilters"
          class="accordion-collapse collapse"
          data-bs-parent="#accordionFilters"
        >
          <div class="accordion-body border-top border-secondary-subtle">
            <form class="row g-3" @submit.prevent="filterData">
              <FieldSelector
                :label-text="$t('FormField.Status')"
                :options-list="stockList"
                field-name="filterStatus"
                v-model:option="filters.inStock"
              />

              <FieldSelector
                :label-text="$t('FormField.Type')"
                :options-list="toolsTypeList"
                field-name="filterToolsType"
                v-model:option="filters.type"
              />

              <div class="col-12 d-flex gap-2 justify-content-center justify-content-md-end mt-2">
                <BtnTable
                  :active-btn="true"
                  btn-class="btn-action-clear text-nowrap"
                  icon="bi-arrow-counterclockwise"
                  :text="$t('Buttons.Clear')"
                  @applyAction="filterClear"
                />

                <BtnTable
                  :active-btn="true"
                  btn-class="btn-action-status text-nowrap"
                  icon="bi-search"
                  :text="$t('Buttons.Filter')"
                  @applyAction="filterData"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import { genericOptionsList } from '@/shared/composables/genericOptionList';
import BtnTable from '@/shared/components/Button/BtnTable.vue';

import { getToolTypes } from '@/features/tools/services/toolType.action';

const { t } = useI18n();

const emit = defineEmits<{
  applyFilter: [inStock: number | null, type: number | null];
}>();

const stockList = genericOptionsList().stockList;
const allToolsTypes = { id: 9999, name: t('SelectOptions.All') };
const toolsTypeList = ref<{ id: number; name: string }[]>([allToolsTypes]);

const filters = reactive({
  inStock: 1 as number,
  type: 9999 as number,
});

onMounted(async () => {
  toolsTypeList.value = [];
  const { ok, data } = await getToolTypes();

  if (ok && data) {
    toolsTypeList.value = [
      allToolsTypes,
      ...data.map((type) => ({
        id: type.id,
        name: type.name,
      })),
    ];
  }
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.inStock !== null) count++;
  if (filters.type !== null) count++;
  return count;
});

const filterClear = () => {
  filters.inStock = 1;
  filters.type = 9999;
  emit('applyFilter', null, null);
};

const filterData = () => {
  emit('applyFilter', filters.inStock, filters.type);
};
</script>

<style scoped>
.filter-card-container :deep(.form-control),
.form-select {
  background-color: var(--bs-body-bg) !important;
  border-color: var(--bs-border-color) !important;
  color: var(--bs-body-color) !important;
}

.filter-card-container :deep(.form-control:focus),
.filter-card-container .form-control:focus,
.form-select:focus {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--brand-primary-rgb), 0.15) !important;
}
</style>
