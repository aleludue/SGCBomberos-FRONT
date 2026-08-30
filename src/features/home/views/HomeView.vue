<template>
  <div class="container">
    <SectionTitle :title="titleDetail" :show-logo="false" />

    <FormAlert
      v-if="userDetail.profileIncomplete"
      text-detail="Todavia no completaste tu perfil. Dentro del mismo podes asociar tu cuenta a una institución."
      :show-button="true"
      view-name="profile"
      button-text="Editar perfil"
    />

    <div v-if="instDetail.showCard" class="col-12 col-md-6 col-lg-4 card card-custom mb-3">
      <div class="card-header-custom">
        <h5 class="m-0 font-weight-bold">Mi institución</h5>
      </div>

      <div class="card-body p-2 pe-4 ps-4">
        <FormAlert
          v-if="!instDetail.isApproved"
          text-detail="Solicitud pendiente de aprobación por parte del administrador de la institución."
        />

        <div
          v-if="instDetail.socialReason"
          class="info-row d-flex justify-content-between align-items-center py-2.5 border-bottom border-secondary-subtle"
        >
          <span class="text-muted-custom small-label">Razon Social</span>
          <span class="fw-semibold text-light text-end">
            {{ instDetail.socialReason }}
          </span>
        </div>

        <div
          v-if="instDetail.isApproved"
          class="info-row d-flex justify-content-between align-items-center py-2.5 border-bottom border-secondary-subtle"
        >
          <span class="text-muted-custom small-label">Bomberos activos</span>
          <span
            class="badge bg-dark-subtle border border-secondary text-light px-3 py-1.5 fs-6 fw-bold"
          >
            {{ instDetail.quantityBomb }}
          </span>
        </div>

        <div
          v-if="instDetail.isApproved"
          class="info-row d-flex justify-content-between align-items-center py-2.5"
        >
          <span class="text-muted-custom small-label">Vehículos activos</span>
          <span
            class="badge bg-dark-subtle border border-secondary text-light px-3 py-1.5 fs-6 fw-bold"
          >
            {{ instDetail.quantityVehi }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import SectionTitle from '@/shared/components/SectionTitle.vue';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import FormAlert from '@/shared/components/FormAlert.vue';

import { getHomeDetail } from '@/features/home/services/home.action';

const { t } = useI18n();
const authStore = useAuthStore();
const { desactivateSpinner } = useSiteConfigStore();
const toast = useToast();

const titleDetail = computed(() => {
  const name = authStore.user?.fullName ?? '';
  return `${t('BaseViews.HomeSubtitle')} ${name}`.trim();
});

const instDetail = reactive({
  isApproved: false,
  socialReason: '',
  quantityBomb: 0,
  quantityVehi: 0,
  showCard: true,
});

const userDetail = reactive({
  profileIncomplete: false,
});

onMounted(async () => {
  const { ok, data } = await getHomeDetail();

  if (ok && data) {
    if (data.institution) {
      instDetail.isApproved = data.institution.isApproved;
      instDetail.socialReason = data.institution.socialReason;
      instDetail.quantityBomb = data.institution.quantityBomb;
      instDetail.quantityVehi = data.institution.quantityVehi;
      instDetail.showCard = true;
    } else {
      instDetail.showCard = false;
    }

    userDetail.profileIncomplete = data.user.profileIncomplete;
  } else {
    toast.error(t('Messages.ErrorLoading'));
  }

  desactivateSpinner();
});
</script>

<style lang="css" scoped>
.card-custom {
  /* background-color: #1a1d20; */
  border: 1px solid var(--brand-primary) !important;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-header-custom {
  background-color: rgba(255, 255, 255, 0.03);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--brand-primary);
}

.small-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.text-muted-custom {
  color: #adb5bd;
}

.info-row {
  min-height: 40px;
}
</style>
