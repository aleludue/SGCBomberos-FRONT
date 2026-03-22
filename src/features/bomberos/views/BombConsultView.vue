<template>
  <title>SGCB - Bomberos</title>
  <div class="container">
    <SectionTitle
      title="Bomberos"
      subtitle="Pantalla de consulta de bomberos registrados en el sistema."
    />

    <Table :tableHeads="tableHeads" :tableData="tableData" />

    <BtnBack :toHome="false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useToast } from 'vue-toastification';

import BtnBack from '@/shared/components/BtnBack.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { getInstitutionBomb } from '@/features/bomberos/services/bomberos.action';
import Table from '@/shared/components/Table.vue';

const configStore = useSiteConfigStore();
const toast = useToast();

const tableHeads = ['#', 'FullName', 'Email', 'InternalNumber', 'IsActive'];
const tableData = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    internalNumber: '12345',
    isActive: 'Yes',
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    internalNumber: '67890',
    isActive: 'No',
  },
  {
    id: '3',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    internalNumber: '12345',
    isActive: 'Yes',
  },
  {
    id: '4',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    internalNumber: '67890',
    isActive: 'No',
  },
  {
    id: '5',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    internalNumber: '12345',
    isActive: 'Yes',
  },
  {
    id: '6',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    internalNumber: '12345',
    isActive: 'Yes',
  },
  {
    id: '7',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    internalNumber: '12345',
    isActive: 'Yes',
  },
  {
    id: '8',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    internalNumber: '67890',
    isActive: 'No',
  },
  {
    id: '9',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    internalNumber: '12345',
    isActive: 'Yes',
  },
  {
    id: '10',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    internalNumber: '67890',
    isActive: 'No',
  },
  {
    id: '11',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    internalNumber: '12345',
    isActive: 'Yes',
  },
  {
    id: '12',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    internalNumber: '67890',
    isActive: 'No',
  },
  {
    id: '13',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    internalNumber: '12345',
    isActive: 'Yes',
  },
  {
    id: '14',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    internalNumber: '67890',
    isActive: 'No',
  },
  {
    id: '15',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    internalNumber: '12345',
    isActive: 'Yes',
  },
  {
    id: '16',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    internalNumber: '67890',
    isActive: 'No',
  },
];

onMounted(async () => {
  configStore.activeSpinner('Cargando bomberos... Espere por favor.');

  try {
    const { data } = await getInstitutionBomb();
    console.log('Bomberos:', data);
  } catch (error) {
    toast.error((error as Error).message);
  } finally {
    configStore.deactivateSpinner();
  }
});
</script>
