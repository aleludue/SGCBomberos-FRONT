<template>
  <form
    @submit.prevent="recoverAccount"
    class="mt-3 d-flex gap-3 flex-column tactical-recover-form"
  >
    <FieldEmail :label-text="$t('FormField.Email')" field-name="email" />

    <FieldNumber
      :label-text="$t('FormField.InternalNum')"
      :is-login-form="true"
      :is-required="true"
      field-name="intNumRec"
    />

    <div class="d-flex flex-column align-items-center gap-2 mt-2">
      <button type="submit" class="btn btn-sm btn-orange-submit py-2 px-4 shadow-sm fw-bold w-100">
        <i class="bi bi-envelope-arrow-up-fill me-1"></i> {{ $t('Buttons.Recover') }}
      </button>

      <button type="button" class="btn btn-sm btn-cancel-link py-1 px-3" @click="emit('backLogin')">
        <i class="bi bi-x-circle me-1"></i> {{ $t('Buttons.Cancel') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';

import { emailRecoverAction } from '@/features/login/services';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import FieldEmail from '@/shared/components/Inputs/FieldEmail.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';

const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const toast = useToast();
const { handleSubmit } = useForm();
const router = useRouter();

const emit = defineEmits<{
  (e: 'backLogin'): void;
}>();

const recoverAccount = handleSubmit(async ({ email, intNumRec }) => {
  activeSpinner('Generando código de recuperación...');
  const { ok, message } = await emailRecoverAction(email, intNumRec);
  if (!ok) {
    toast.error(message);
  } else {
    toast.success(message);
    await router.push(`/auth/recover/${email}`);
  }
  desactivateSpinner();
});
</script>

<style scoped>
.btn-orange-submit {
  background-color: var(--brand-primary) !important;
  color: var(--bs-on-brand-color) !important;
  font-weight: 700;
  border: none !important;
  border-radius: 8px !important;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(var(--brand-primary-rgb), 0.15) !important;
}

.btn-orange-submit:hover {
  background-color: var(--brand-primary-dark) !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(var(--brand-primary-rgb), 0.35) !important;
}

.btn-cancel-link {
  background: transparent !important;
  border: none !important;
  color: var(--bs-secondary-color) !important;
  font-weight: 600;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.btn-cancel-link:hover {
  color: var(--bs-on-brand-color) !important;
  text-decoration: underline;
}

.tactical-recover-form :deep(.form-label),
.tactical-recover-form :deep(label) {
  color: var(--bs-secondary-color) !important;
  font-weight: 600;
  font-size: 0.8rem;
}
</style>
