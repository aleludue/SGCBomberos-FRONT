<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover table-bordered">
      <thead>
        <tr>
          <th class="text-center" scope="col">Selec.</th>
          <th v-for="head in tableHeads" :key="head" class="text-center" scope="col">
            {{ head }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!tableData.length">
          <td :colspan="tableHeads.length + 1" class="text-center italic text-muted">
            {{ $t('TableComponent.NoResults') }}
          </td>
        </tr>

        <tr v-else v-for="data in dataTableShown" :key="data.id">
          <td class="text-center">
            <input class="form-check-input" type="radio" :value="data.id" v-model="selectedRowId" />
          </td>
          <td
            v-for="(value, key) in data"
            :key="key"
            class="text-center"
            :class="{ 'd-none': key === 'id' }"
          >
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Paginación -->
  <div v-if="cantPages > 0" class="d-flex mt-1 justify-content-between align-items-center">
    <div class="d-flex align-items-center gap-2">
      <label for="rowsSelect" class="form-label m-0 small">{{ $t('TableComponent.Show') }}:</label>
      <select class="form-select form-select-sm w-auto" id="rowsSelect" v-model="rowsQuantity">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
      </select>
    </div>

    <nav aria-label="tableNavigation">
      <ul class="pagination pagination-sm m-0">
        <li class="page-item" :class="{ disabled: actualPage === 1 }">
          <button class="page-link" @click="actualPage--">
            {{ $t('TableComponent.Previous') }}
          </button>
        </li>
        <li
          v-for="page in cantPages"
          :key="page"
          class="page-item"
          :class="{ active: page === actualPage }"
        >
          <button class="page-link" @click="actualPage = page">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: actualPage === cantPages }">
          <button class="page-link" @click="actualPage++">{{ $t('TableComponent.Next') }}</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  tableHeads: { type: Array as () => string[], default: () => [] },
  tableData: { type: Array as () => any[], default: () => [] },
});

const emit = defineEmits<{
  selectRow: [id: number];
}>();

const actualPage = ref(1);
const rowsQuantity = ref(5);
const selectedRowId = ref(0);

const cantPages = computed(() => Math.ceil(props.tableData.length / rowsQuantity.value));

const dataTableShown = computed(() => {
  const start = (actualPage.value - 1) * rowsQuantity.value;
  const end = start + rowsQuantity.value;
  return props.tableData.slice(start, end);
});

watch([() => props.tableData, rowsQuantity], () => {
  actualPage.value = 1;
  selectedRowId.value = 0;
});

watch(selectedRowId, (newId) => {
  if (newId !== 0) emit('selectRow', newId);
});
</script>
