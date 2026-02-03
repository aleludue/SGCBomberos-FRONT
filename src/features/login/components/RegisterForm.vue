<template>
  <div class="p-1">
    <form @submit.prevent="validateFormReg" class="mt-2">
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

      <EmailField :label-text="$t('RegisterView.EmailTitle')" ref="emailFieldRef" />

      <PassField
        :label-text="$t('RegisterView.PassTitle')"
        :btn-view-pass="false"
        ref="passFieldRef"
      />

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
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

import { registerAction } from '@/features/login/services';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import EmailField from '@/features/login/components/EmailField.vue';
import PassField from '@/features/login/components/PassField.vue';

const { t } = useI18n();
const toast = useToast();
const settingStore = useSiteConfigStore();
const emit = defineEmits(['newEmail']);

const regFormEval = yup.object({
  fullNameReg: yup.string().required().min(5),
  email: yup.string().required().email(),
  pass: yup.string().required().min(8),
  confirmPass: yup
    .string()
    .required()
    .min(8)
    .oneOf([yup.ref('pass')], t('ValidationMsg.PasswordMismatch')),
});

const { handleSubmit } = useForm({
  validationSchema: regFormEval,
});

const {
  value: fullNameRegValue,
  errorMessage: fullNameRegError,
  handleBlur: fullNameRegBlur,
  resetField: resetFullNameRegField,
} = useField('fullNameReg');

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
      value.email,
      value.passReg,
      value.confirmPass,
    );

    if (!resp.ok) {
      toast.error(resp.message);
    } else {
      toast.success(t('RegisterView.SuccessMsg'));
      emit('newEmail', value.emailReg);

      const emailFieldRef = ref<InstanceType<typeof EmailField> | null>(null);
      emailFieldRef.value?.resetEmailField();

      const passFieldRef = ref<InstanceType<typeof PassField> | null>(null);
      passFieldRef.value?.resetPassField();

      resetFullNameRegField();
      resetConfirmPassField();
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  settingStore.deactivateSpinner();
});
</script>
