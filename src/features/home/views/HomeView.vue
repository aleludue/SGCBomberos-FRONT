<template>
  <div class="container">
    <SectionTitle :title="titleDetail" :breadcrumb="true" :show-logo="false" />

    <FormAlert
      v-if="userDetail.profileIncomplete"
      :text-detail="t('BaseViews.HomeProfileAlert')"
      :show-button="true"
      view-name="profile"
      :button-text="t('BaseViews.HomeProfileAlertBtn')"
    />

    <div v-if="instDetail.showCard" class="col-12 col-md-6 card card-custom mb-3">
      <div class="card-header-custom">
        <h5 class="m-0 fw-bold">{{ t('BaseViews.HomeInstCardTitle') }}</h5>
      </div>

      <div class="card-body p-2 pe-4 ps-4">
        <FormAlert v-if="!instDetail.isApproved" :text-detail="t('BaseViews.HomeInstCardAlert')" />

        <div
          v-if="instDetail.socialReason"
          class="info-row d-flex justify-content-between align-items-center py-2.5 border-bottom border-secondary-subtle"
        >
          <span class="text-muted-custom small-label fw-bold">{{
            t('FormField.SocialReason')
          }}</span>
          <span class="fw-semibold text-body text-end">
            {{ instDetail.socialReason }}
          </span>
        </div>

        <div class="row g-3 mt-1">
          <div v-if="instDetail.isApproved" class="col-6">
            <div
              class="info-row d-flex justify-content-between align-items-center border-bottom border-secondary-subtle pb-2 h-100"
            >
              <span class="text-muted-custom small-label fw-bold">{{
                t('BaseViews.HomeInstCardBomb')
              }}</span>
              <span
                class="badge bg-body-secondary border border-secondary-subtle text-body px-3 py-1.5 fs-6 fw-bold shadow-sm"
              >
                {{ instDetail.quantityBomb }}
              </span>
            </div>
          </div>

          <div v-if="instDetail.isApproved" class="col-6">
            <div
              class="info-row d-flex justify-content-between align-items-center border-bottom border-secondary-subtle pb-2 h-100"
            >
              <span class="text-muted-custom small-label fw-bold">{{
                t('BaseViews.HomeInstCardVehi')
              }}</span>
              <span
                class="badge bg-body-secondary border border-secondary-subtle text-body px-3 py-1.5 fs-6 fw-bold shadow-sm"
              >
                {{ instDetail.quantityVehi }}
              </span>
            </div>
          </div>

          <div v-if="instDetail.quantityIntervMonth" class="col-6">
            <div
              class="info-row d-flex justify-content-between align-items-center border-bottom border-secondary-subtle pb-2 h-100"
            >
              <span class="text-muted-custom small-label fw-bold">Salidas mensuales</span>
              <span
                class="badge bg-body-secondary border border-secondary-subtle text-body px-3 py-1.5 fs-6 fw-bold shadow-sm"
              >
                {{ instDetail.quantityIntervMonth }}
              </span>
            </div>
          </div>

          <div v-if="instDetail.quantityIntervYear" class="col-6">
            <div
              class="info-row d-flex justify-content-between align-items-center border-bottom border-secondary-subtle pb-2 h-100"
            >
              <span class="text-muted-custom small-label fw-bold">Salidas anuales</span>
              <span
                class="badge bg-body-secondary border border-secondary-subtle text-body px-3 py-1.5 fs-6 fw-bold shadow-sm"
              >
                {{ instDetail.quantityIntervYear }}
              </span>
            </div>
          </div>
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
  quantityIntervMonth: 1,
  quantityIntervYear: 1,
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
  border: 1px solid var(--brand-primary) !important;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-header-custom {
  background-color: var(--bs-tertiary-bg);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--bs-border-color-translucent);
  color: var(--brand-primary);
}

.small-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.text-muted-custom {
  color: var(--bs-body-color);
}

.info-row {
  min-height: 40px;
}
</style>
