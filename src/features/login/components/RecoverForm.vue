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
      <BtnConfirm type="submit" size="sm">
        <i class="bi bi-envelope-arrow-up-fill me-1"></i> {{ $t('Buttons.Recover') }}
      </BtnConfirm>

      <button type="button" class="btn btn-cancel-link" @click="goToLoginRoute">
        <i class="bi bi-x-circle me-1"></i> {{ $t('Buttons.Cancel') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { emailRecoverAction } from '@/features/login/services';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import FieldEmail from '@/shared/components/Inputs/FieldEmail.vue';
import FieldNumber from '@/shared/components/Inputs/FieldNumber.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';

const { t } = useI18n();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const toast = useToast();
const { handleSubmit } = useForm();
const router = useRouter();

const emit = defineEmits<{
  backLogin: [];
}>();

const recoverAccount = handleSubmit(async ({ email, intNumRec }) => {
  activeSpinner(t('Messages.CreateRecoverCode'));
  const { ok, message } = await emailRecoverAction(email, intNumRec);
  if (!ok) {
    toast.error(message);
  } else {
    toast.success(message);
    await router.push(`/auth/recover/${email}`);
  }
  desactivateSpinner();
});

const goToLoginRoute = () => {
  emit('backLogin');
};
</script>

<style scoped>
.btn-cancel-link {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.btn-cancel-link:hover {
  color: #ffffff;
  text-decoration: underline;
}

.tactical-recover-form :deep(.form-label),
.tactical-recover-form :deep(label) {
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.8rem;
}
</style>
