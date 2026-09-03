<template>
  <div class="d-flex align-items-start justify-content-center w-100 style-login-viewport">
    <div class="col-11 login-card-tactical shadow animate-fade-in">
      <TitleLogoForm />

      <div class="col-12">
        <h3 class="mb-3 text-center fw-bold text-themed-title text-uppercase small-caps-title">
          {{ $t('BaseViews.RecoverTitle') }}
        </h3>

        <form @submit.prevent="startRecover" class="d-flex gap-2 flex-column">
          <FieldEmail :label-text="$t('FormField.Email')" field-name="email" :is-required="true" />

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

          <BtnConfirm
            type="submit"
            size="md"
            class="mt-2"
            icon="bi-envelope-arrow-up-fill"
            :text-detail="$t('Buttons.Recover')"
          />

          <button
            type="button"
            class="btn btn-sm btn-cancel-link py-1 px-3 mt-1"
            @click="goToLoginRoute()"
          >
            <i class="bi bi-x-circle me-1"></i> {{ $t('Buttons.Cancel') }}
          </button>
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
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
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
.text-themed-title {
  color: var(--bs-body-color) !important;
  transition: color 0.2s;
}

:global([data-bs-theme='dark']) .text-themed-title {
  color: var(--bs-on-brand-color) !important;
}

.small-caps-title {
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}
</style>
