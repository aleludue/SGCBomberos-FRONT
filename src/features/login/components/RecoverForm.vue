<template>
  <form @submit.prevent="recoverAccount" class="mt-2 d-flex gap-3 flex-column">
    <EmailField :label-text="$t('LoginView.EmailTitle')" />

    <div class="form-floating">
      <input
        v-model="intNumValue"
        type="text"
        class="form-control"
        autocomplete="off"
        placeholder=""
        @blur="intNumBlur"
        :class="{ 'border-danger is-invalid': intNumError }"
      />
      <label for="intNumRec">{{ $t('LoginView.InternalNumRecover') }}</label>
      <span v-if="intNumError" class="text-danger">{{ intNumError }}</span>
    </div>

    <div class="text-center">
      <button type="submit" class="btn btn-outline-primary me-3">
        <i class="bi bi-envelope-arrow-up-fill"></i>
        {{ $t('LoginView.BtnRecover') }}
      </button>

      <button class="btn btn-outline-secondary" @click="emit('backLogin')">
        <i class="bi bi-x-circle"></i>
        {{ $t('GenericBtn.BtnCancel') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { number } from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { useField, useForm } from 'vee-validate';

import { emailRecoverAction } from '@/features/login/services';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import EmailField from '@/shared/components/Inputs/FieldEmail.vue';
import router from '@/router';

const { t } = useI18n();
const settingStore = useSiteConfigStore();
const toast = useToast();
const { handleSubmit } = useForm();

const emit = defineEmits<{
  (e: 'backLogin'): void;
}>();

const {
  value: intNumValue,
  errorMessage: intNumError,
  handleBlur: intNumBlur,
} = useField(
  'intNumRec',
  number().typeError(t('ValidationMsg.NumType')).required().min(0).integer(),
);

const recoverAccount = handleSubmit(async (values) => {
  settingStore.activeSpinner('Generando código de recuperación...');

  try {
    const result = await emailRecoverAction(values.email, values.intNumRec);

    if (!result.ok) {
      toast.error(result.message);
    } else {
      toast.success('Código de recuperación enviado exitosamente.');
      router.push(`/auth/recover/${values.email}`);
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  settingStore.deactivateSpinner();
});
</script>
