<template>
  <Form
    @submit="onLogin"
    class="mt-2"
    :validation-schema="valLogin"
    v-slot="{ errors }"
    v-if="!recoverForm"
  >
    <div class="mb-3 form-floating">
      <Field
        v-model="formLog.email"
        type="text"
        id="emailLog"
        name="emailLog"
        class="form-control"
        autocomplete="off"
        placeholder=""
        :class="{ 'border-danger is-invalid': errors.emailLog }"
      />
      <label for="emailLog">{{ $t('LoginView.EmailTitle') }}</label>
      <ErrorMessage name="emailLog" class="text-danger"></ErrorMessage>
    </div>

    <div class="input-group">
      <div class="form-floating">
        <Field
          v-model="formLog.pass"
          :type="showPassword ? 'text' : 'password'"
          id="passLog"
          name="passLog"
          class="form-control"
          autocomplete="off"
          placeholder=""
          :class="{ 'border-danger is-invalid': errors.passLog }"
        />
        <label for="passLog">{{ $t('LoginView.PassTitle') }}</label>
      </div>
      <span role="button" class="input-group-text" @click="showPassword = !showPassword"
        ><i class="bi bi-eye"></i
      ></span>
    </div>
    <ErrorMessage name="passLog" class="text-danger"></ErrorMessage>

    <div class="mt-2 mb-3 text-blue-500">
      <a href="#" class="hover:underline" @click="recoverForm = !recoverForm">{{
        $t('LoginView.RecoverPassLink')
      }}</a>
    </div>

    <div class="text-center">
      <button type="submit" class="btn btn-outline-primary">
        <i class="bi bi-door-open"></i> {{ $t('LoginView.BtnLogin') }}
      </button>
    </div>
  </Form>

  <RecoverForm v-else @backLogin="recoverForm = !recoverForm" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useRouter } from 'vue-router';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { object, string } from 'yup';
import RecoverForm from './RecoverForm.vue';

const authStore = useAuthStore();
const settingStore = useSiteConfigStore();
const router = useRouter();
const showPassword = ref(false);

const recoverForm = ref(false);

const valLogin = object({
  emailLog: string().required().email(),
  passLog: string().required().min(8),
});

const formLog = reactive({
  email: '',
  pass: '',
});

const onLogin = async () => {
  settingStore.activeSpinner('Iniciando sesión...');
  const ok = await authStore.login(formLog.email, formLog.pass);
  settingStore.deactivateSpinner();

  if (ok) return router.replace('/');
};
</script>
