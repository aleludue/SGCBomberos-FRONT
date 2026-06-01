<template>
  <div
    class="col-12 shadow rounded border border-secondary-subtle bg-body-tertiary mb-1 filter-card-container"
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

              <div class="col-12 col-md-4">
                <label for="filterStatus" class="form-label small fw-bold text-muted">
                  {{ $t('FormField.Status') }}
                </label>
                <select
                  class="form-select bg-body shadow-sm border-secondary-subtle text-body"
                  id="filterStatus"
                  v-model="filters.status"
                >
                  <option value="All">{{ $t('SelectOptions.All') }}</option>
                  <option value="Active">{{ $t('SelectOptions.Active') }}</option>
                  <option value="Inactive">{{ $t('SelectOptions.Inactive') }}</option>
                </select>
              </div>

              <div class="col-12 d-flex justify-content-md-end justify-content-center gap-2 mt-3">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary px-3"
                  @click="filterClear"
                >
                  <i class="bi bi-arrow-counterclockwise me-1"></i> {{ $t('Buttons.Clear') }}
                </button>
                <button type="submit" class="btn btn-sm btn-orange-submit px-4 shadow-sm fw-bold">
                  <i class="bi bi-search me-1"></i> {{ $t('Buttons.Filter') }}
                </button>
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

const emit = defineEmits<{
  applyFilter: [fullName: string | null, internalNum: number | null, isActive: boolean | null];
}>();

const filters = reactive({
  fullName: '',
  internalNum: null as number | null,
  status: 'All',
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.fullName.trim() !== '') count++;
  if (filters.internalNum !== null && filters.internalNum > 0) count++;
  if (filters.status !== 'All') count++;
  return count;
});

const filterClear = () => {
  filters.fullName = '';
  filters.internalNum = null;
  filters.status = 'All';
  emit('applyFilter', null, null, null);
};

const filterData = () => {
  const isActive = filters.status === 'All' ? null : filters.status === 'Active';
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
