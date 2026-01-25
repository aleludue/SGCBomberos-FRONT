<template>
  <div class="p-1">
    <form ref="registerForm" @submit.prevent="validateFormReg" class="mt-2">
      <div class="mb-2 form-floating">
        <input
          v-model="fullNameRegValue"
          type="text"
          class="form-control"
          placeholder=""
          @blur="fullNameRegBlur"
          :class="{ 'border-danger is-invalid': fullNameRegError }"
        />
        <label class="form-label" for="fullNameReg">{{ $t('RegisterView.FullNameTitle') }}</label>
        <span v-if="fullNameRegError" class="text-danger">{{ fullNameRegError }}</span>
      </div>

      <div class="mb-2 form-floating">
        <input
          v-model="emailRegValue"
          type="email"
          class="form-control"
          placeholder=""
          @blur="emailRegBlur"
          :class="{ 'border-danger is-invalid': emailRegError }"
        />
        <label class="form-label" for="emailReg">{{ $t('RegisterView.EmailTitle') }}</label>
        <span v-if="emailRegError" class="text-danger">{{ emailRegError }}</span>
      </div>

      <div class="mb-2 form-floating">
        <input
          v-model="passRegValue"
          type="password"
          class="form-control"
          autocomplete="new-password"
          placeholder=""
          @blur="passRegBlur"
          :class="{ 'border-danger is-invalid': passRegError }"
        />
        <label for="passReg" class="form-label">{{ $t('RegisterView.PassTitle') }}</label>
        <span v-if="passRegError" class="text-danger">{{ passRegError }}</span>
      </div>

      <div class="mb-3 form-floating">
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
        <span v-if="confirmPassError" class="text-danger">{{ confirmPassError }}</span>
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
import { object, string } from 'yup';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';

import { registerAction } from '@/features/account/services';
import { useSiteConfigStore } from '@/shared/stores/config.store';

const { t } = useI18n();
const toast = useToast();
const settingStore = useSiteConfigStore();
const emit = defineEmits(['newEmail']);

const regFormEval = object({
  fullNameReg: string().required().min(5),
  emailReg: string().required().email(),
  passReg: string().required().min(8),
  confirmPass: string()
    .required()
    .min(8)
    .oneOf([yup.ref('passReg')], t('ValidationMsg.PasswordMismatch')),
});

const { handleSubmit } = useForm({
  validationSchema: regFormEval,
});

const {
  value: emailRegValue,
  errorMessage: emailRegError,
  handleBlur: emailRegBlur,
  resetField: resetEmailRegField,
} = useField('emailReg');

const {
  value: fullNameRegValue,
  errorMessage: fullNameRegError,
  handleBlur: fullNameRegBlur,
  resetField: resetFullNameRegField,
} = useField('fullNameReg');

const {
  value: passRegValue,
  errorMessage: passRegError,
  handleBlur: passRegBlur,
  resetField: resetPassRegField,
} = useField('passReg');

const {
  value: confirmPassValue,
  errorMessage: confirmPassError,
  handleBlur: confirmPassBlur,
  resetField: resetConfirmPassField,
} = useField('confirmPass');

const validateFormReg = handleSubmit(async (value) => {
  settingStore.activeSpinner('Registando usuario...');

  try {
    const resp = await registerAction(
      value.fullNameReg,
      value.emailReg,
      value.passReg,
      value.confirmPass,
    );

    if (!resp.ok) {
      toast.error(resp.message);
    } else {
      toast.success(t('RegisterView.RegisterSuccessMsg'));
      emit('newEmail', value.emailReg);

      resetEmailRegField();
      resetFullNameRegField();
      resetPassRegField();
      resetConfirmPassField();
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  settingStore.deactivateSpinner();
});
</script>
