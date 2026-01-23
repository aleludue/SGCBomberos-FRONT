<template>
  <div class="p-1">
    <Form
      ref="registerForm"
      @submit="validateFormReg"
      class="mt-2"
      :validation-schema="schema"
      v-slot="{ errors }"
    >
      <div class="mb-2 form-floating">
        <Field
          v-model="regForm.fullName"
          type="text"
          id="fullNameReg"
          name="fullNameReg"
          class="form-control"
          placeholder=""
          :class="{ 'border-danger is-invalid': errors.fullNameReg }"
        />
        <label class="form-label" for="fullNameReg">{{ $t('RegisterView.FullNameTitle') }}</label>
        <ErrorMessage name="fullNameReg" class="text-danger"></ErrorMessage>
      </div>

      <div class="mb-2 form-floating">
        <Field
          v-model="regForm.email"
          type="email"
          id="emailReg"
          name="emailReg"
          class="form-control"
          placeholder=""
          :class="{ 'border-danger is-invalid': errors.emailReg }"
        />
        <label class="form-label" for="emailReg">{{ $t('RegisterView.EmailTitle') }}</label>
        <ErrorMessage name="emailReg" class="text-danger"></ErrorMessage>
      </div>

      <div class="mb-2 form-floating">
        <Field
          v-model="regForm.password"
          type="password"
          id="passReg"
          name="passReg"
          class="form-control"
          autocomplete="new-password"
          placeholder=""
          :class="{ 'border-danger is-invalid': errors.passReg }"
        />
        <label for="passReg" class="form-label">{{ $t('RegisterView.PassTitle') }}</label>
        <ErrorMessage name="passReg" class="text-danger"></ErrorMessage>
      </div>

      <div class="mb-3 form-floating">
        <Field
          v-model="regForm.confirmPassword"
          type="password"
          id="confirmPass"
          name="confirmPass"
          class="form-control"
          autocomplete="new-password"
          placeholder=""
          :class="{ 'border-danger is-invalid': errors.confirmPass }"
        />
        <label for="confirmPass" class="form-label">{{
          $t('RegisterView.ConfirmPassTitle')
        }}</label>
        <ErrorMessage name="confirmPass" class="text-danger"></ErrorMessage>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-outline-primary">
          <i class="bi bi-person-plus"></i>
          {{ $t('RegisterView.BtnRegister') }}
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { object, string } from 'yup';
import { ErrorMessage, Field, Form } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { registerAction } from '@/features/account/services';
import { useSiteConfigStore } from '@/shared/stores/config.store';

const { t } = useI18n();
const toast = useToast();
const settingStore = useSiteConfigStore();
const emit = defineEmits(['newEmail']);
const registerForm = ref<any>(null);

const regForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
});

const schema = object({
  fullNameReg: string().required().min(5),
  emailReg: string().required().email(),
  passReg: string().required().min(8),
  confirmPass: string()
    .required()
    .min(8)
    .oneOf([yup.ref('passReg')], t('ValidationMsg.PasswordMismatch')),
});

const validateFormReg = async () => {
  settingStore.activeSpinner('Registando usuario...');

  try {
    const resp = await registerAction(
      regForm.fullName,
      regForm.email,
      regForm.password,
      regForm.confirmPassword,
    );

    if (!resp.ok) {
      toast.error(resp.message);
    } else {
      emit('newEmail', regForm.email);
      regForm.fullName = '';
      regForm.email = '';
      regForm.password = '';
      regForm.confirmPassword = '';
      registerForm.value.resetForm();
      toast.success(t('RegisterView.RegisterSuccessMsg'));
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  settingStore.deactivateSpinner();
};
</script>
