<template>
  <div class="tab-pane fade px-1" id="maint-tab-pane" role="tabpanel" tabindex="0">
    <p>Componente con mantenimientos del vehículo - {{ props.id }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { getVehicleMaintenanceDetails } from '../services/vehicles.action';

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
  const vehiMaintenanceData = await getVehicleMaintenanceDetails(props.id);

  if (vehiMaintenanceData.ok) {
    if (vehiMaintenanceData.data) {
      console.log('Datos del vehículo:', vehiMaintenanceData.data);
    }
  } else {
    toast.error(vehiMaintenanceData.message ?? t('Messages.ErrorLoading'));
  }
});
</script>
