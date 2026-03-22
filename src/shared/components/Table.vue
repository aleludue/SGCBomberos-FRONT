<template>
  <div class="table-responsive mt-3">
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th scope="col" v-for="heads in props.tableHeads" :key="heads">{{ heads }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in dataTableShown" :key="data.id">
          <td scope="row" v-for="value in data" :key="value">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="row text-center" v-if="!props.tableData || props.tableData.length === 0">
    <p>Sin registros para la consulta.</p>
  </div>

  <div class="row" v-if="cantPages > 0">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#" @click="prevPage">Previous</a></li>
        <li v-for="value in cantPages" :key="value" class="page-item">
          <a
            class="page-link"
            :class="value === actualPage ? 'active' : ''"
            href="#"
            @click="goPage(value)"
            >{{ value }}</a
          >
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

const cantPages = ref(0);
const actualPage = ref(1);
const dataTableShown = ref<any[]>([]);

watch(
  () => props.tableData,
  (newData) => {
    const cantReg = newData ? newData.length : 0;

    if (newData && cantReg !== 0) {
      cantPages.value = Math.ceil(cantReg / 10);
      dataTableShown.value = newData.slice(0, 10);
      actualPage.value = 1;
    }
  },
  { immediate: true },
);

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
