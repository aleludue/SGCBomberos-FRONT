<template>
  <div class="col-12 mt-3 border">
    <div class="accordion accordion-flush" id="accordionFilters">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed btn-noShadow"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#flush-collapseFilters"
            aria-expanded="false"
            aria-controls="flush-collapseFilters"
          >
            {{ $t('BombFilterComponent.Title') }}
          </button>
        </h2>
        <div
          id="flush-collapseFilters"
          class="accordion-collapse collapse"
          data-bs-parent="#accordionFilters"
        >
          <div class="accordion-body">
            <form class="row d-flex flex-wrap" @submit.prevent="">
              <div class="col-12 col-md-3">
                <label for="filterFullName" class="col-form-label">
                  {{ $t('BombFilterComponent.FullName') }}
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="filterFullName"
                  v-model="filterFullName"
                />
              </div>
              <div class="col-12 col-md-3">
                <label for="filterInterNumber" class="col-form-label">
                  {{ $t('BombFilterComponent.InternalNum') }}
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="filterInterNumber"
                  v-model="filterInternalNum"
                />
              </div>
              <div class="col-12 col-md-3">
                <label for="filterStatus" class="col-form-label">
                  {{ $t('BombFilterComponent.Status') }}
                </label>
                <select class="form-select" id="filterStatus" v-model="filterStatus">
                  <option value="All">{{ $t('BombFilterComponent.StatusAll') }}</option>
                  <option value="Active">{{ $t('BomberListView.StatusActive') }}</option>
                  <option value="Inactive">{{ $t('BomberListView.StatusInactive') }}</option>
                </select>
              </div>
              <div class="col-12 col-md-3 mt-3 d-flex align-self-end justify-content-center gap-2">
                <button class="btn btn-outline-primary" @click="filterData">
                  {{ $t('GenericBtn.BtnFilter') }}
                </button>
                <button class="btn btn-outline-secondary" @click="filterClear">
                  {{ $t('GenericBtn.BtnClear') }}
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
import { ref } from 'vue';

const emit = defineEmits(['applyFilter']);

const filterFullName = ref('');
const filterInternalNum = ref('');
const filterStatus = ref('All');

const filterClear = () => {
  filterFullName.value = '';
  filterInternalNum.value = '';
  filterStatus.value = 'All';

  emit('applyFilter', null, null, null);
};

const filterData = () => {
  const isActive = filterStatus.value === 'All' ? null : filterStatus.value === 'Active';
  const internalNum = filterInternalNum.value ? Number(filterInternalNum.value) : null;
  emit('applyFilter', filterFullName.value || null, internalNum, isActive);
};
</script>
