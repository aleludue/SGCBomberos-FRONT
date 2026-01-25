<template>
  <form @submit.prevent="onLogin" class="mt-2" v-if="!recoverForm">
    <div class="mb-3 form-floating">
      <input
        v-model="emailValue"
        type="text"
        class="form-control"
        autocomplete="off"
        placeholder=""
        @blur="emailBlur"
        :class="{ 'border-danger is-invalid': emailError }"
      />
      <label for="emailLog">{{ $t('LoginView.EmailTitle') }}</label>
      <span v-if="emailError" class="text-danger">{{ emailError }}</span>
    </div>

    <div class="input-group">
      <div class="form-floating">
        <input
          v-model="passValue"
          :type="showPassword ? 'text' : 'password'"
          class="form-control"
          autocomplete="off"
          placeholder=""
          @blur="passBlur"
          :class="{ 'border-danger is-invalid': passError }"
        />
        <label for="passLog">{{ $t('LoginView.PassTitle') }}</label>
      </div>
      <span role="button" class="input-group-text" @click="showPassword = !showPassword"
        ><i class="bi bi-eye"></i
      ></span>
    </div>
    <span v-if="passError" class="text-danger">{{ passError }}</span>

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
  </form>

  <RecoverForm v-else @backLogin="recoverForm = !recoverForm" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

import { useAuthStore } from '@/shared/stores/auth.store';
import RecoverForm from '@/features/login/components/RecoverForm.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

const authStore = useAuthStore();
const settingStore = useSiteConfigStore();
const router = useRouter();
const showPassword = ref(false);
const recoverForm = ref(false);

const props = defineProps<{
  newEmail?: string;
}>();

const logFormEval = yup.object({
  email: yup.string().required().email(),
  pass: yup.string().required().min(8),
});

const { handleSubmit } = useForm({
  validationSchema: logFormEval,
});

const { value: emailValue, errorMessage: emailError, handleBlur: emailBlur } = useField('email');
const {
  value: passValue,
  errorMessage: passError,
  handleBlur: passBlur,
  resetField: resetPassField,
} = useField('pass');

const onLogin = handleSubmit(async (values) => {
  settingStore.activeSpinner('Iniciando sesión...');
  if (await authStore.login(values.email, values.pass)) return router.replace('/');
  settingStore.deactivateSpinner();
});

watch(
  () => props.newEmail,
  (newVal) => {
    if (newVal) {
      emailValue.value = newVal;
      resetPassField();
    }
  },
  { immediate: true },
);
</script>
