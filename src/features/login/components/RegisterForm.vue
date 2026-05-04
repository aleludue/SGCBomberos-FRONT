<template>
  <div class="p-1">
    <form @submit.prevent="validateFormReg" class="mt-2 d-flex gap-3 flex-column">
      <FieldText
        :label-text="$t('RegisterView.FullNameTitle')"
        :is-login-form="true"
        :field-name="'fullNameReg'"
        :min-length="6"
        :is-required="true"
      />

      <FieldEmail
        :label-text="$t('RegisterView.EmailTitle')"
        ref="emailFieldRef"
        :field-name="'email'"
      />

      <FieldPass
        :label-text="$t('RegisterView.PassTitle')"
        :btn-view-pass="false"
        :field-name="'pass'"
        ref="passFieldRef"
      />

      <div class="form-floating">
        <input
          v-model="confirmPassValue"
          type="password"
          class="form-control"
          autocomplete="new-password"
          placeholder=""
          @blur="confirmPassBlur"
          :class="{ 'border-danger is-invalid': confirmPassError }"
        />
        <label for="confirmPass" class="form-label">{{
          $t('RegisterView.ConfirmPassTitle')
        }}</label>
        <span v-if="confirmPassError" class="invalid-feedback">{{ confirmPassError }}</span>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-outline-primary">
          <i class="bi bi-person-plus"></i>
          {{ $t('RegisterView.BtnRegister') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

import { registerAction } from '@/features/login/services';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import FieldEmail from '@/shared/components/Inputs/FieldEmail.vue';
import FieldPass from '@/shared/components/Inputs/FieldPass.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';

const { t } = useI18n();
const toast = useToast();
const settingStore = useSiteConfigStore();
const emit = defineEmits(['newEmail']);

const { handleSubmit, values } = useForm();

const {
  value: confirmPassValue,
  errorMessage: confirmPassError,
  handleBlur: confirmPassBlur,
  resetField: resetConfirmPassField,
} = useField(
  'confirmPass',
  yup
    .string()
    .required()
    .min(8)
    .test('match-pass', t('ValidationMsg.PasswordMismatch'), (value) => value === values.pass),
);

const validateFormReg = handleSubmit(async () => {
  settingStore.activeSpinner('Registando usuario...');

  try {
    const resp = await registerAction(
      values.fullNameReg,
      values.email,
      values.pass,
      values.confirmPass,
    );

    if (!resp.ok) {
      toast.error(resp.message);
    } else {
      toast.success(t('RegisterView.SuccessMsg'));
      emit('newEmail', values.email);

      const emailFieldRef = ref<InstanceType<typeof FieldEmail> | null>(null);
      emailFieldRef.value?.resetEmailField();

      const passFieldRef = ref<InstanceType<typeof FieldPass> | null>(null);
      passFieldRef.value?.resetPassField();

      const textFieldRef = ref<InstanceType<typeof FieldText> | null>(null);
      textFieldRef.value?.resetTextField();

      resetConfirmPassField();
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  settingStore.deactivateSpinner();
});
</script>
