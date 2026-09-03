<template>
  <form @submit.prevent="recoverAccount" class="mt-3 d-flex gap-3 flex-column">
    <FieldEmail :label-text="$t('FormField.Email')" field-name="email" :is-required="true" />

    <FieldNumber
      :label-text="$t('FormField.InternalNum')"
      :is-login-form="true"
      :is-required="true"
      field-name="intNumRec"
    />

    <div class="d-flex flex-column align-items-center gap-2 mt-2">
      <BtnConfirm
        type="submit"
        size="sm"
        icon="bi-envelope-arrow-up-fill"
        :text-detail="$t('Buttons.Recover')"
      />

      <button
        type="button"
        class="btn btn-sm btn-cancel-link py-1 px-3 mt-1"
        @click="goToLoginRoute"
      >
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
