<template>
  <div class="p-1">
    <Form @submit.prevent="validateForm" class="mt-2" :validation-schema="schema">
      <div class="mb-2">
        <label class="form-label" for="fullNameReg">{{ $t('RegisterView.FullNameTitle') }}</label>
        <Field
          v-model="regForm.fullName"
          ref="fullNameRegInputRef"
          type="text"
          id="fullNameReg"
          name="fullNameReg"
          class="form-control"
          :placeholder="$t('RegisterView.FullNamePlaceholder')"
        />
        <ErrorMessage name="fullNameReg"></ErrorMessage>
      </div>

      <div class="mb-2">
        <label class="form-label" for="emailReg">{{ $t('RegisterView.EmailTitle') }}</label>
        <Field
          v-model="regForm.email"
          ref="emailRegInputRef"
          type="email"
          id="emailReg"
          name="emailReg"
          class="form-control"
          :placeholder="$t('RegisterView.EmailPlaceholder')"
        />
        <ErrorMessage name="emailReg"></ErrorMessage>
      </div>

      <div class="mb-2">
        <label for="passReg" class="form-label">{{ $t('RegisterView.PassTitle') }}</label>
        <Field
          v-model="regForm.password"
          ref="passRegInputRef"
          type="password"
          id="passReg"
          name="passReg"
          class="form-control"
          autocomplete="new-password"
          :placeholder="$t('RegisterView.PassPlaceholder')"
        />
        <ErrorMessage name="passReg"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="confirmPass" class="form-label">{{
          $t('RegisterView.ConfirmPassTitle')
        }}</label>
        <Field
          v-model="regForm.confirmPassword"
          ref="confirmPassInputRef"
          type="password"
          id="confirmPass"
          name="confirmPass"
          class="form-control"
          autocomplete="new-password"
          :placeholder="$t('RegisterView.ConfirmPassPlaceholder')"
        />
        <ErrorMessage name="confirmPass"></ErrorMessage>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-outline-primary">
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

const toast = useToast();

const regForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
});

const schema = object({
  emailReg: string().required().email(),
  passReg: string().required().min(8),
  confirmPass: string().required().min(8).equals([regForm.password], 'Passwords must match'),
  fullNameReg: string().required().min(5),
});

const validateForm = async () => {
  try {
    schema.validateSync(regForm);
  } catch (error) {
    toast.error((error as Error).message);
  }
};
</script>
