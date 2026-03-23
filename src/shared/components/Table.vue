<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover border rounded">
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
        <tr v-for="data in dataTableShown" :key="data.id">
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

  <div class="text-center" v-if="!props.tableData || props.tableData.length === 0">
    <p>Sin resultados para la consulta.</p>
  </div>

  <div v-if="cantPages > 0">
    <nav aria-label="tableNavigation" class="d-flex justify-content-end">
      <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#" @click="prevPage">Previous</a></li>
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
        <li class="page-item"><a class="page-link" href="#" @click="nextPage">Next</a></li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
  tableHeads?: string[];
  tableData?: any[];
}>();

const emit = defineEmits(['selectRow']);

const cantPages = ref(0);
const actualPage = ref(1);
const dataTableShown = ref<any[]>([]);
const selectedRowId = ref(0);

watch(
  () => props.tableData,
  (newData) => {
    selectedRowId.value = 0;
    const cantReg = newData ? newData.length : 0;

    if (newData && cantReg !== 0) {
      cantPages.value = Math.ceil(cantReg / 10);
      dataTableShown.value = newData.slice(0, 10);
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

const prevPage = () => {
  if (actualPage.value > 1) {
    actualPage.value -= 1;
    const startIndex = (actualPage.value - 1) * 10;
    dataTableShown.value = props.tableData
      ? props.tableData.slice(startIndex, startIndex + 10)
      : [];
  }
};

const nextPage = () => {
  if (actualPage.value < cantPages.value) {
    actualPage.value += 1;
    const startIndex = (actualPage.value - 1) * 10;
    dataTableShown.value = props.tableData
      ? props.tableData.slice(startIndex, startIndex + 10)
      : [];
  }
};

const goPage = (page: number) => {
  actualPage.value = page;
  const startIndex = (actualPage.value - 1) * 10;
  dataTableShown.value = props.tableData ? props.tableData.slice(startIndex, startIndex + 10) : [];
};
</script>
