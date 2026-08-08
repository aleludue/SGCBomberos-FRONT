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
              <FieldText
                :label-text="$t('FormField.FullName')"
                v-model:text-det="filters.fullName"
                field-name="filterFullName"
              />

              <FieldNumber
                :label-text="$t('FormField.InternalNum')"
                v-model:num-val="filters.internalNum"
                field-name="filterInterNumber"
              />

              <FieldSelector
                :label-text="$t('FormField.Status')"
                :options-list="statusList"
                field-name="filterStatus"
                v-model:option="filters.status"
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
                  btn-class="btn-action-edit text-nowrap"
                  icon="bi-search"
                  :text="$t('Buttons.Filter')"
                  type="submit"
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
import { computed, reactive } from 'vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import FieldSelector from '@/shared/components/Inputs/FieldSelector.vue';
import { genericOptionsList } from '@/shared/composables/genericOptionList';
import BtnTable from '@/shared/components/Button/BtnTable.vue';

const emit = defineEmits<{
  applyFilter: [fullName: string | null, internalNum: number | null, isActive: boolean | null];
}>();

const statusList = genericOptionsList().statusList;

const filters = reactive({
  fullName: '',
  internalNum: null as number | null,
  status: 1,
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.fullName.trim() !== '') count++;
  if (filters.internalNum !== null && filters.internalNum > 0) count++;
  if (filters.status !== 1) count++;
  return count;
});

const filterClear = () => {
  filters.fullName = '';
  filters.internalNum = null;
  filters.status = 1;
  emit('applyFilter', null, null, null);
};

const filterData = () => {
  const isActive = filters.status === 1 ? null : filters.status === 2;
  const internalNum =
    filters.internalNum !== null && filters.internalNum > 0 ? Number(filters.internalNum) : null;
  const fullName = filters.fullName.trim() || null;
  emit('applyFilter', fullName, internalNum, isActive);
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
