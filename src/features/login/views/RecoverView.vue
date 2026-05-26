<template>
  <div class="d-flex align-items-start justify-content-center w-100 style-login-viewport">
    <div class="col-11 login-card-tactical shadow animate-fade-in">
      <TitleLogoForm />

      <div class="col-12 mt-2">
        <h3 class="mb-3 text-center fw-bold text-themed-title text-uppercase small-caps-title">
          {{ $t('BaseViews.RecoverTitle') }}
        </h3>

        <form
          @submit.prevent="startRecover"
          class="mt-2 d-flex gap-3 flex-column tactical-recover-inner"
        >
          <FieldEmail :label-text="$t('FormField.Email')" field-name="email" />

          <FieldText
            :label-text="$t('FormField.RecoverCode')"
            :is-login-form="true"
            :is-required="true"
            :is-alfa-oblig="true"
            :length="8"
            field-name="code"
          />

          <FieldPass
            :label-text="$t('FormField.PassNew')"
            :btn-view-pass="false"
            field-name="pass"
          />

          <FieldPass
            v-model:origin-pass="values.pass"
            :label-text="$t('FormField.PassNewConfirm')"
            :btn-view-pass="false"
            :is-confirm-field="true"
            field-name="confirmPass"
          />

          <div class="d-flex flex-column align-items-center gap-2 mt-2 w-100">
            <button
              type="submit"
              class="btn btn-sm btn-orange-submit py-2 px-4 shadow-sm fw-bold w-100"
            >
              <i class="bi bi-arrow-repeat me-1"></i> {{ $t('Buttons.Recover') }}
            </button>

            <button
              type="button"
              class="btn btn-sm btn-cancel-link py-1 px-3 mt-1"
              @click="goToLoginRoute()"
            >
              <i class="bi bi-x-circle me-1"></i> {{ $t('Buttons.Cancel') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { onMounted } from 'vue';

import FieldEmail from '@/shared/components/Inputs/FieldEmail.vue';
import TitleLogoForm from '@/features/login/components/TitleLogoForm.vue';
import FieldPass from '@/shared/components/Inputs/FieldPass.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { passChangeAction } from '@/features/login/services';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();

onMounted(() => {
  desactivateSpinner();
});

const { handleSubmit, values } = useForm({
  initialValues: {
    email: (route.params.email as string) || '',
    code: '',
    pass: '',
    confirmPass: '',
  },
});

const startRecover = handleSubmit(async ({ email, code, pass, confirmPass }) => {
  activeSpinner('Actualizando usuario...');
  const { ok, message } = await passChangeAction(email, code, pass, confirmPass);
  if (!ok) {
    toast.error(message);
  } else {
    toast.success(message);
    goToLoginRoute();
  }
  desactivateSpinner();
});

const goToLoginRoute = async () => {
  await router.push({ name: 'login' });
};
</script>

<style scoped>
.style-login-viewport {
  height: 100dvh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  padding-top: 4dvh !important;
}

.login-card-tactical {
  max-width: 400px;
  margin: 0 auto;
  background-color: #161920 !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6) !important;
  padding: 2rem !important;
}

.text-themed-title {
  color: #f8f9fa;
}

.small-caps-title {
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.btn-orange-submit {
  background-color: #ff6b00 !important;
  color: #ffffff !important;
  font-weight: 700;
  border: none !important;
  border-radius: 8px !important;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.15) !important;
}

.btn-orange-submit:hover {
  background-color: #e05e00 !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(255, 107, 0, 0.35) !important;
}

.btn-cancel-link {
  background: transparent !important;
  border: none !important;
  color: #94a3b8 !important;
  font-weight: 600;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.btn-cancel-link:hover {
  color: #ffffff !important;
  text-decoration: underline;
}

.tactical-recover-inner :deep(.form-control) {
  background-color: #2b3035 !important;
  border: 1px solid #495057 !important;
  color: #f8f9fa !important;
  border-radius: 8px !important;
  padding: 0.75rem 1rem !important;
}

.tactical-recover-inner :deep(.form-control:focus) {
  border-color: #ff6b00 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.2) !important;
}

/* Etiquetas de texto del formulario */
.tactical-recover-inner :deep(.form-label),
.tactical-recover-inner :deep(label) {
  color: #94a3b8 !important;
  font-weight: 600;
  font-size: 0.8rem;
}

.tactical-recover-inner :deep(.bi-eye),
.tactical-recover-inner :deep(.bi-eye-slash) {
  color: #adb5bd !important;
}

.animate-fade-in {
  animation: fadeInStyle 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeInStyle {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
