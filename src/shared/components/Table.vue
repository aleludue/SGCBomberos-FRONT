<template>
  <div class="d-flex justify-content-between align-items-center mb-1">
    <div></div>

    <div class="btn-group btn-group-sm" role="group" aria-label="Modo de vista">
      <button
        type="button"
        class="btn shadow-none"
        :class="viewMode === 'table' ? 'btn-secondary' : 'btn-outline-secondary'"
        @click="viewMode = 'table'"
        title="Vista Tabla"
      >
        <i class="bi bi-table"></i>
      </button>
      <button
        type="button"
        class="btn shadow-none"
        :class="viewMode === 'card' ? 'btn-secondary' : 'btn-outline-secondary'"
        @click="viewMode = 'card'"
        title="Vista Tarjetas"
      >
        <i class="bi bi-grid-3x3-gap-fill"></i>
      </button>
    </div>
  </div>

  <div class="table-responsive table-mobile-cards" :class="`force-${viewMode}`">
    <table class="table table-striped table-hover table-bordered align-middle mb-1">
      <thead class="table-dark table-header">
        <tr>
          <th v-if="canSelect" class="text-center">Selec.</th>
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
          class="mobile-card cursor-pointer"
          :class="{ 'card-selected': selectedRowId === row.id }"
          @click="selectedRowId = row.id"
        >
          <td v-if="canSelect" class="text-center cell-selection">
            <div
              class="d-flex justify-content-between align-items-center w-100 container-selection"
            >
              <input
                :id="`radio-${viewMode}-${row.id}`"
                class="form-check-input"
                type="radio"
                :value="row.id"
                v-model="selectedRowId"
              />
              <label
                :for="`radio-${viewMode}-${row.id}`"
                class="card-header-text m-0 cursor-pointer label-selection"
              >
                {{
                  selectedRowId === row.id
                    ? $t('SelectOptions.Selected')
                    : $t('SelectOptions.SelectRow')
                }}
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
  <div v-if="cantPages > 0" class="d-flex justify-content-between align-items-center">
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
            <i class="bi bi-arrow-bar-left"></i>
          </button>
        </li>

        <li
          v-for="(page, index) in visiblePages"
          :key="index"
          class="page-item"
          :class="{ active: page === actualPage, disabled: page === '...' }"
        >
          <button class="page-link" @click="page !== '...' ? (actualPage = Number(page)) : null">
            {{ page }}
          </button>
        </li>

        <li class="page-item" :class="{ disabled: actualPage === cantPages }">
          <button class="page-link" @click="actualPage++">
            <i class="bi bi-arrow-bar-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

interface TableRowData {
  id: number;
  [key: string]: string | number | boolean | Date | null | undefined;
}

const props = withDefaults(
  defineProps<{
    tableHeads?: string[];
    tableData?: TableRowData[];
    canSelect?: boolean;
  }>(),
  {
    tableHeads: () => [],
    tableData: () => [],
    canSelect: true,
  },
);

const emit = defineEmits<{
  selectRow: [id: number];
}>();

const actualPage = ref(1);
const rowsQuantity = ref(5);
const selectedRowId = ref(0);

const viewMode = ref<'table' | 'card'>('card');

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

const maxVisiblePages = 3;

const visiblePages = computed(() => {
  const pages = [];

  pages.push(1);

  let start = Math.max(2, actualPage.value - Math.floor(maxVisiblePages / 2));
  const end = Math.min(cantPages.value - 1, start + maxVisiblePages - 1);

  if (end === cantPages.value - 1) {
    start = Math.max(2, end - maxVisiblePages + 1);
  }

  if (start > 2) {
    pages.push('...');
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < cantPages.value - 1) {
    pages.push('...');
  }

  if (cantPages.value > 1) {
    pages.push(cantPages.value);
  }

  return pages;
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
.empty-text {
  font-style: italic;
}

@media (min-width: 768px) {
  .table-mobile-cards:not(.force-card) .table-header {
    display: table-header-group !important;
  }
  .table-mobile-cards:not(.force-card) table {
    display: table !important;
    width: 100% !important;
  }
  .table-mobile-cards:not(.force-card) tr {
    display: table-row !important;
  }
  .table-mobile-cards:not(.force-card) td,
  .table-mobile-cards:not(.force-card) th {
    display: table-cell !important;
    text-align: center !important;
    vertical-align: middle !important;
  }
  .table-mobile-cards:not(.force-card) .container-selection {
    display: block !important;
    text-align: center;
  }
  .table-mobile-cards:not(.force-card) .label-selection {
    display: none !important;
  }
  .table-mobile-cards:not(.force-card) .form-check-input {
    float: none;
    margin: 0 0;
  }
  .table-mobile-cards:not(.force-card) tr.card-selected td {
    background-color: rgba(var(--brand-primary-rgb), 0.06) !important;
  }
}

.force-table .table-header {
  display: table-header-group !important;
}
.force-table table {
  display: table !important;
  width: 100% !important;
}
.force-table tr {
  display: table-row !important;
}
.force-table td,
.force-table th {
  display: table-cell !important;
  text-align: center !important;
  vertical-align: middle !important;
}
.force-table .container-selection {
  display: block !important;
  text-align: center;
}
.force-table .label-selection {
  display: none !important;
}
.force-table .form-check-input {
  float: none;
  margin: 0 0;
}
.force-table tr.card-selected td {
  background-color: rgba(var(--brand-primary-rgb), 0.06) !important;
}

@media (max-width: 767.98px) {
  .table-mobile-cards:not(.force-table) .table-header {
    display: none !important;
  }
  .table-mobile-cards:not(.force-table) table,
  .table-mobile-cards:not(.force-table) tbody,
  .table-mobile-cards:not(.force-table) td {
    display: block !important;
    width: 100% !important;
  }
}

.force-card .table-header {
  display: none !important;
}
.force-card table,
.force-card tbody,
.force-card td {
  display: block !important;
  width: 100% !important;
}

.table-mobile-cards:not(.force-table) tr.mobile-card,
.force-card tr.mobile-card {
  display: flex !important;
  flex-direction: column !important;
  margin-bottom: 1rem !important;
  border: 1px solid var(--bs-border-color) !important;
  border-radius: 12px !important;
  background: var(--bs-body-bg) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  overflow: hidden;
  content-visibility: auto;
  width: 100% !important;
}

.table-mobile-cards:not(.force-table) tr.mobile-card-empty,
.force-card tr.mobile-card-empty {
  display: block !important;
  margin-bottom: 1rem !important;
  border: 1px solid var(--bs-border-color) !important;
  border-radius: 12px !important;
  background: var(--bs-tertiary-bg) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02) !important;
  overflow: hidden;
  width: 100% !important;
}

.table-mobile-cards:not(.force-table) td.empty-cell,
.force-card td.empty-cell {
  padding: 20px 10px !important;
  border: none !important;
}

.table-mobile-cards:not(.force-table) tr.card-selected,
.force-card tr.card-selected {
  border-color: var(--brand-primary) !important;
  box-shadow: 0 4px 16px rgba(var(--brand-primary-rgb), 0.15) !important;
}

.table-mobile-cards:not(.force-table) td.cell-selection,
.force-card td.cell-selection {
  display: block !important;
  background: var(--bs-tertiary-bg) !important;
  padding: 12px 15px !important;
  border-bottom: 1px solid var(--bs-border-color) !important;
  width: 100% !important;
}

.table-mobile-cards:not(.force-table) .label-selection,
.force-card .label-selection {
  display: inline-block !important;
}

.table-mobile-cards:not(.force-table) .card-header-text,
.force-card .card-header-text {
  color: var(--brand-primary);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.table-mobile-cards:not(.force-table) td.mobile-cell,
.force-card td.mobile-cell {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px !important;
  border-bottom: 1px solid var(--bs-border-color-translucent) !important;
  text-align: right !important;
  color: var(--bs-body-color);
  min-height: 45px;
  width: 100% !important;
}

.table-mobile-cards:not(.force-table) td.mobile-cell::before,
.force-card td.mobile-cell::before {
  content: attr(data-label);
  font-weight: 700;
  color: var(--bs-secondary-color);
  font-size: 0.7rem;
  text-transform: uppercase;
  text-align: left;
  flex: 1;
  padding-right: 15px;
}

.table-mobile-cards:not(.force-table) td:last-child,
.force-card td:last-child {
  border-bottom: none !important;
}
</style>
