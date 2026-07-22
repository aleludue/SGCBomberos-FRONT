<template>
  <div class="tab-pane fade px-1" id="tools-tab-pane" role="tabpanel" tabindex="0">
    <p>Componente con herramientas del vehículo - {{ props.id }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { getVehicleToolsDetails } from '../services/vehicles.action';

const { t } = useI18n();
const toast = useToast();

const props = withDefaults(
  defineProps<{
    id: number;
  }>(),
  {
    id: 0,
  },
);

onMounted(async () => {
  const vehiToolsData = await getVehicleToolsDetails(props.id);

  if (vehiToolsData.ok) {
    if (vehiToolsData.data) {
      console.log('Datos del vehículo:', vehiToolsData.data);
    }
  } else {
    toast.error(vehiToolsData.message ?? t('Messages.ErrorLoading'));
  }
});
</script>
