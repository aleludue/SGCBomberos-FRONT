<template>
  <div class="table-responsive table-mobile-cards">
    <table class="table table-striped table-hover table-bordered align-middle mb-1">
      <thead class="table-dark d-none d-md-table-header-group">
        <tr>
          <th class="text-center">Selec.</th>
          <th v-for="head in tableHeads" :key="head" class="text-center">{{ head }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!tableData.length" class="mobile-card-empty">
          <td :colspan="tableHeads.length + 1" class="text-center py-4 empty-cell">
            <div class="d-flex flex-column align-items-center justify-content-center gap-2">
              <i class="bi bi-search text-muted mb-1 fs-3"></i>
              <span class="empty-text text-muted">{{ $t('Messages.NoResults') }}</span>
            </div>
          </td>
        </tr>

        <tr
          v-else
          v-for="row in structuredRows"
          :key="row.id"
          class="mobile-card"
          :class="{ 'card-selected': selectedRowId === row.id }"
        >
          <td class="text-center cell-selection">
            <div class="d-flex justify-content-between align-items-center w-100">
              <input
                :id="'radio-' + row.id"
                class="form-check-input"
                type="radio"
                :value="row.id"
                v-model="selectedRowId"
              />
              <label :for="'radio-' + row.id" class="card-header-text d-md-none m-0 cursor-pointer">
                {{ selectedRowId === row.id ? 'Seleccionado' : 'Seleccionar Fila' }}
              </label>
            </div>
          </td>
          <td
            v-for="cell in row.cells"
            :key="row.id + '-' + cell.key"
            class="mobile-cell"
            :class="'cell-' + cell.key"
            :data-label="cell.label"
          >
            {{ cell.value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Paginación -->
  <div v-if="cantPages > 0" class="d-flex justify-content-between align-items-center mt-1">
    <div class="d-flex align-items-center gap-2">
      <label for="rowsSelect" class="form-label m-0 small">{{ $t('Buttons.Show') }}:</label>
      <select
        class="form-select form-select-sm w-auto bg-body text-body border-secondary-subtle"
        id="rowsSelect"
        v-model="rowsQuantity"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
      </select>
    </div>
    <nav aria-label="tableNavigation">
      <ul class="pagination pagination-sm m-0">
        <li class="page-item" :class="{ disabled: actualPage === 1 }">
          <button class="page-link" @click="actualPage--">
            {{ $t('Buttons.Previous') }}
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
          <button class="page-link" @click="actualPage++">{{ $t('Buttons.Next') }}</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

interface TableRowData {
  id: number;
  [key: string]: any;
}

const props = withDefaults(
  defineProps<{
    tableHeads?: string[];
    tableData?: TableRowData[];
  }>(),
  {
    tableHeads: () => [],
    tableData: () => [],
  },
);

const emit = defineEmits<{
  selectRow: [id: number];
}>();

const actualPage = ref(1);
const rowsQuantity = ref(5);
const selectedRowId = ref(0);

const cantPages = computed(() => Math.ceil(props.tableData.length / rowsQuantity.value));

const structuredRows = computed(() => {
  const start = (actualPage.value - 1) * rowsQuantity.value;
  return props.tableData.slice(start, start + rowsQuantity.value).map((data) => {
    const cells = Object.keys(data)
      .filter((key) => key !== 'id')
      .map((key, index) => ({
        key,
        value: data[key],
        label: props.tableHeads[index] || '',
      }));
    return { id: data.id, cells };
  });
});

watch([() => props.tableData, rowsQuantity], () => {
  actualPage.value = 1;
  selectedRowId.value = 0;
});

watch(selectedRowId, (newId) => {
  emit('selectRow', newId);
});

watch(actualPage, () => {
  selectedRowId.value = 0;
});
</script>

<style scoped>
@media (min-width: 768px) {
  .table-mobile-cards thead {
    display: table-header-group !important;
  }
  .table-mobile-cards table {
    display: table !important;
  }
  .table-mobile-cards tr {
    display: table-row !important;
  }
  .table-mobile-cards td,
  .table-mobile-cards th {
    display: table-cell !important;
    text-align: center !important;
    vertical-align: middle !important;
  }
  .table-mobile-cards .cell-selection .d-flex {
    display: block !important;
    text-align: center;
  }
  .table-mobile-cards .form-check-input {
    float: none;
    margin: 0 0;
  }
  .empty-text {
    font-style: italic;
  }
}

@media (max-width: 767.98px) {
  .table-mobile-cards thead {
    display: none !important;
  }
  .table-mobile-cards table,
  .table-mobile-cards tbody,
  .table-mobile-cards tr.mobile-card,
  .table-mobile-cards tr.mobile-card-empty,
  .table-mobile-cards td {
    display: block !important;
    width: 100% !important;
  }

  .table-mobile-cards tr.mobile-card {
    margin-bottom: 1rem !important;
    border: 1px solid var(--bs-border-color) !important;
    border-radius: 12px !important;
    background: var(--bs-body-bg) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
    overflow: hidden;
    content-visibility: auto;
  }

  .table-mobile-cards tr.mobile-card-empty {
    margin-bottom: 1rem !important;
    border: 1px solid var(--bs-border-color) !important;
    border-radius: 12px !important;
    background: var(--bs-tertiary-bg) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02) !important;
    overflow: hidden;
  }

  .table-mobile-cards td.empty-cell {
    padding: 20px 10px !important;
    border: none !important;
  }

  .table-mobile-cards tr.card-selected {
    border-color: var(--brand-primary) !important;
    box-shadow: 0 4px 16px rgba(var(--brand-primary-rgb), 0.15) !important;
  }

  .table-mobile-cards td.cell-selection {
    background: var(--bs-tertiary-bg) !important;
    padding: 12px 15px !important;
    border-bottom: 1px solid var(--bs-border-color) !important;
  }

  .table-mobile-cards .card-header-text {
    color: var(--brand-primary);
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  .table-mobile-cards td.mobile-cell {
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px !important;
    border-bottom: 1px solid var(--bs-border-color-translucent) !important;
    text-align: right !important;
    color: var(--bs-body-color);
    min-height: 45px;
  }

  .table-mobile-cards td.mobile-cell::before {
    content: attr(data-label);
    font-weight: 700;
    color: var(--bs-secondary-color);
    font-size: 0.7rem;
    text-transform: uppercase;
    text-align: left;
    flex: 1;
  }

  .table-mobile-cards td:last-child {
    border-bottom: none !important;
  }
}
</style>
