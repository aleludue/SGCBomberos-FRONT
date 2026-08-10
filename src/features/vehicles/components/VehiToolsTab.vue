<template>
  <div class="tab-pane fade px-1" id="tools-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column gap-2">
      <div class="row row-cols-2 row-cols-sm-auto g-2">
        <BtnTable
          :activeBtn="true"
          btnClass="btn-action-add"
          icon="bi-file-earmark-plus"
          :text="$t('Buttons.Add')"
          @click="addVehiTool"
          data-bs-toggle="modal"
          data-bs-target="#vehiToolManageModal"
        />
      </div>

      <div class="settings-card-container mt-2">
        <div
          class="accordion accordion-flush rounded border border-secondary-subtle overflow-hidden"
          id="accordionTools"
        >
          <div
            v-for="(tool, index) in vehiToolList"
            :key="index"
            class="accordion-item bg-transparent text-body border-0"
          >
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed fw-bold text-body bg-transparent py-3 px-4"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#collapse' + index"
                aria-expanded="false"
                :aria-controls="'collapse' + index.toString()"
              >
                <i class="bi bi-tools text-orange-fire me-2"></i> {{ tool.toolType }}
              </button>
            </h2>
            <div
              :id="'collapse' + index.toString()"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionTools"
            >
              <div class="accordion-body border-top border-secondary-subtle bg-body">
                <div class="col-12 d-flex flex-wrap">
                  <div
                    v-for="toolDet in tool.toolList"
                    :key="toolDet.id"
                    class="d-flex flex-row justify-content-between mb-2 me-2 p-3 border rounded-3"
                  >
                    <div class="me-2">
                      <p class="mb-1">
                        <strong>{{ t('FormField.Name') }}: </strong>{{ toolDet.name }}
                      </p>
                      <p class="mb-1">
                        <strong>{{ t('FormField.Mark') }}: </strong>{{ toolDet.mark }}
                      </p>
                      <p class="mb-1">
                        <strong>{{ t('FormField.Count') }}: </strong>{{ toolDet.quantity }}
                      </p>
                    </div>
                    <div class="ms-4">
                      <button
                        class="btn btn-action-edit"
                        @click="editVehiTool(toolDet.id)"
                        data-bs-toggle="modal"
                        data-bs-target="#vehiToolManageModal"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <VehiToolManageModal
    :id-vehi="props.id"
    v-model:tool-vehi-det="selectVehiTool"
    v-model:id="selectedRowId"
    @confirm="loadDataTable"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { onMounted, ref, watch } from 'vue';

import BtnTable from '@/shared/components/Button/BtnTable.vue';

import type {
  ToolListDet,
  VehicleToolsData,
} from '@/features/vehicles/interfaces/vehicles.interfaces';
import VehiToolManageModal from '@/features/vehicles/components/VehiToolManageModal.vue';
import { getVehicleToolsDetails } from '@/features/vehicles/services/vehicles.action';

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

const emit = defineEmits<{
  toolsCant: [toolsQuantity: number];
}>();

const vehiToolList = ref<VehicleToolsData[] | null>(null);
const selectedRowId = ref(0);
const selectVehiTool = ref<ToolListDet | null>(null);

onMounted(async () => {
  if (props.id === 0) {
    return;
  }

  await loadDataTable();
});

const loadDataTable = async () => {
  const { ok, data, message } = await getVehicleToolsDetails(props.id);

  if (ok) {
    if (data) {
      vehiToolList.value = data;
    }
  } else {
    toast.error(message ?? t('Messages.ErrorLoading'));
  }
};

const addVehiTool = () => {};

const editVehiTool = async (idTool: number) => {
  if (idTool) {
    selectedRowId.value = idTool;
    let vehiToolDet = null;

    vehiToolList.value?.forEach((element) => {
      const result = element.toolList.find((x) => x.id == idTool);

      if (result) vehiToolDet = result;
    });

    selectVehiTool.value = vehiToolDet;
  }
};

watch(
  () => vehiToolList.value,
  async (newVal) => {
    if (newVal == null) {
      emit('toolsCant', 0);
      return;
    }

    let cantReg = 0;

    newVal?.forEach((x) => {
      cantReg += x.toolList.length;
    });

    emit('toolsCant', cantReg);
  },
);
</script>
