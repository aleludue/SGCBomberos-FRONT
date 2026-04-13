<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover table-bordered">
      <thead>
        <tr>
          <th class="text-center" scope="col">Selec.</th>
          <th scope="col" class="d-none">Id</th>
          <th class="text-center" scope="col" v-for="heads in props.tableHeads" :key="heads">
            {{ heads }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!props.tableData || props.tableData.length === 0">
          <td :colspan="props.tableHeads?.length + 2" class="text-center">
            {{ $t('TableComponent.NoResults') }}
          </td>
        </tr>
        <tr v-else v-for="data in dataTableShown" :key="data.id">
          <td scope="row" class="text-center">
            <input class="form-check-input" type="radio" v-model="selectedRowId" :value="data.id" />
          </td>
          <td
            scope="row"
            class="text-center"
            v-for="value in data"
            :key="value"
            :class="{ 'd-none': value === data.id }"
          >
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="cantPages > 0" class="d-flex mt-1 justify-content-between align-items-center">
    <div class="d-flex align-items-center gap-2">
      <label for="rowsSelect" class="form-label m-0">{{ $t('TableComponent.Show') }}:</label>
      <select class="form-select" id="rowsSelect" v-model="rowsQuantity">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
      </select>
    </div>
    <nav aria-label="tableNavigation" class="d-flex align-items-center">
      <ul class="pagination m-0">
        <li class="page-item">
          <a class="page-link" href="#" @click="prevPage">{{ $t('TableComponent.Previous') }}</a>
        </li>
        <li v-for="value in cantPages" :key="value" class="page-item">
          <a
            class="page-link"
            :class="value === actualPage ? 'active' : ''"
            href="#"
            @click="goPage(value)"
          >
            {{ value }}
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#" @click="nextPage">{{ $t('TableComponent.Next') }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
  tableHeads: string[];
  tableData: any[];
}>();

const emit = defineEmits(['selectRow']);

const cantPages = ref(0);
const actualPage = ref(1);
const dataTableShown = ref<any[]>([]);
const selectedRowId = ref(0);
const rowsQuantity = ref(5);

watch(
  () => props.tableData,
  (newData) => {
    selectedRowId.value = 0;
    const cantReg = newData ? newData.length : 0;

    if (newData && cantReg !== 0) {
      cantPages.value = Math.ceil(cantReg / rowsQuantity.value);
      dataTableShown.value = newData.slice(0, rowsQuantity.value);
      actualPage.value = 1;
    } else {
      cantPages.value = 0;
      dataTableShown.value = [];
      actualPage.value = 1;
    }
  },
  { immediate: true },
);

watch(selectedRowId, (newId) => {
  emit('selectRow', newId);
});

watch(
  () => rowsQuantity.value,
  (newQuantity) => {
    if (props.tableData) {
      cantPages.value = Math.ceil(props.tableData.length / newQuantity);
      const startIndex = (actualPage.value - 1) * newQuantity;
      dataTableShown.value = props.tableData.slice(startIndex, startIndex + newQuantity);
    }
  },
  { immediate: true },
);

const prevPage = () => {
  if (actualPage.value > 1) {
    actualPage.value -= 1;
    const startIndex = (actualPage.value - 1) * rowsQuantity.value;
    dataTableShown.value = props.tableData
      ? props.tableData.slice(startIndex, startIndex + rowsQuantity.value)
      : [];
  }
};

const nextPage = () => {
  if (actualPage.value < cantPages.value) {
    actualPage.value += 1;
    const startIndex = (actualPage.value - 1) * rowsQuantity.value;
    dataTableShown.value = props.tableData
      ? props.tableData.slice(startIndex, startIndex + rowsQuantity.value)
      : [];
  }
};

const goPage = (page: number) => {
  actualPage.value = page;
  const startIndex = (actualPage.value - 1) * rowsQuantity.value;
  dataTableShown.value = props.tableData
    ? props.tableData.slice(startIndex, startIndex + rowsQuantity.value)
    : [];
};
</script>
