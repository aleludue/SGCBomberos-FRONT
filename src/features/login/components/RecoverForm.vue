<template>
  <form @submit.prevent="recoverAccount" class="mt-2 d-flex gap-3 flex-column">
    <FieldEmail :label-text="$t('LoginView.EmailTitle')" field-name="email" />

    <FieldNumber
      :label-text="$t('LoginView.InternalNumRecover')"
      :is-login-form="true"
      :is-required="true"
      field-name="intNumRec"
    />

    <div class="text-center">
      <button type="submit" class="btn btn-outline-primary me-3">
        <i class="bi bi-envelope-arrow-up-fill"></i>
        {{ $t('LoginView.BtnRecover') }}
      </button>

      <button type="button" class="btn btn-outline-secondary" @click="emit('backLogin')">
        <i class="bi bi-x-circle"></i>
        {{ $t('GenericBtn.BtnCancel') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';

import { emailRecoverAction } from '@/features/login/services';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import FieldEmail from '@/shared/components/Inputs/FieldEmail.vue';
import router from '@/router';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';

const { activeSpinner, deactivateSpinner } = useSiteConfigStore();
const toast = useToast();
const { handleSubmit } = useForm();

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
    router.push(`/auth/recover/${email}`);
  }

  deactivateSpinner();
});
</script>
