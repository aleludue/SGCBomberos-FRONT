<template>
  <div class="tab-pane fade" id="bomb-tab-pane" role="tabpanel" tabindex="0">
    <div class="d-flex flex-column">
      <div class="row d-flex">
        <AssistBombCard
          v-for="assisDet in assistBombList"
          v-bind:key="assisDet.id"
          :bomb-detail="assisDet"
          :general-detail="assistAllDet"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AssistBombCard from '@/features/assistances/components/AssistBombCard.vue';
import type {
  AsistBombDetail,
  AsistGeneralData,
} from '@/features/assistances/interfaces/assistances.interfaces';

const assistBombList = defineModel<AsistBombDetail[]>('assistBombList');
const assistAllDet = defineModel<AsistGeneralData | null>('assistAllDet');
</script>
