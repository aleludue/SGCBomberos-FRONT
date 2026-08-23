<template>
  <form @submit.prevent="validateFormReg" class="d-flex gap-2 flex-column">
    <FieldText
      ref="fullNameRef"
      :label-text="$t('FormField.FullName')"
      :is-login-form="true"
      :is-required="true"
      :min-length="6"
      field-name="fullNameReg"
    />

    <FieldEmail ref="emailRef" :label-text="$t('FormField.Email')" field-name="email" />

    <FieldPass
      ref="passRef"
      :label-text="$t('FormField.PassNew')"
      :btn-view-pass="false"
      field-name="pass"
    />

    <FieldPass
      ref="passConfirmRef"
      v-model:origin-pass="values.pass"
      :label-text="$t('FormField.PassNewConfirm')"
      :btn-view-pass="false"
      :is-confirm-field="true"
      field-name="confirmPass"
    />

    <BtnConfirm
      type="submit"
      size="sm"
      class="mt-2"
      icon="bi-person-plus"
      :text-detail="$t('Buttons.Register')"
    />
  </form>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

import { registerAction } from '@/features/login/services';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import FieldEmail from '@/shared/components/Inputs/FieldEmail.vue';
import FieldPass from '@/shared/components/Inputs/FieldPass.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';

const { t } = useI18n();
const toast = useToast();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const { handleSubmit, values, resetForm } = useForm();

const emit = defineEmits<{
  newEmail: [email: string];
}>();

const fullNameRef = ref<InstanceType<typeof FieldText> | null>(null);
const emailRef = ref<InstanceType<typeof FieldEmail> | null>(null);
const passRef = ref<InstanceType<typeof FieldPass> | null>(null);
const passConfirmRef = ref<InstanceType<typeof FieldPass> | null>(null);

const validateFormReg = handleSubmit(async ({ fullNameReg, email, pass, confirmPass }) => {
  activeSpinner(t('Messages.CreateUser'));

  const { ok, message } = await registerAction(fullNameReg, email, pass, confirmPass);

  if (!ok) {
    toast.error(message);
  } else {
    toast.success(t('Messages.SuccessRegister'));
    emit('newEmail', email);

    resetForm();
    fullNameRef.value?.resetTextField?.();
    emailRef.value?.resetEmailField?.();
    passRef.value?.resetPassField?.();
    passConfirmRef.value?.resetPassField?.();
  }

  desactivateSpinner();
});
</script>
