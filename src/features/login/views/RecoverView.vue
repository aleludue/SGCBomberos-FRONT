<template>
  <title>{{ $t('RecoverView.ViewTitle') }}</title>

  <div class="container p-3">
    <div class="col-11 p-4 pt-3 rounded shadow bg-body" style="max-width: 400px; margin: auto">
      <TitleLogoForm />

      <div class="col-12">
        <h3 class="mb-3 text-center">{{ $t('RecoverView.Title') }}</h3>
        <form @submit.prevent="startRecover" class="mt-2">
          <EmailField :label-text="$t('LoginView.EmailTitle')" />

          <div class="mb-3 form-floating">
            <input
              v-model="codeValue"
              type="text"
              class="form-control text-uppercase"
              autocomplete="off"
              placeholder=""
              @blur="codeBlur"
              :class="{ 'border-danger is-invalid': codeError }"
            />
            <label for="codeLog">{{ $t('RecoverView.CodeTitle') }}</label>
            <span v-if="codeError" class="text-danger">{{ codeError }}</span>
          </div>

          <div class="mb-2 text-center">
            <button type="submit" class="btn btn-outline-primary me-3">
              <i class="bi bi-arrow-repeat"></i>
              {{ $t('LoginView.BtnRecover') }}
            </button>

            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="router.push({ name: 'login' })"
            >
              <i class="bi bi-x-circle"></i>
              {{ $t('GenericBtn.BtnCancel') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { object, string } from 'yup';

import EmailField from '@/features/login/components/EmailField.vue';
import TitleLogoForm from '@/features/login/components/TitleLogoForm.vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const recoverFormEval = object({
  email: string().required().email(),
  code: string()
    .required()
    .length(8)
    .matches(/^[a-zA-Z0-9]+$/, t('ValidationMsg.MatchAlphanumeric')),
});

const { handleSubmit } = useForm({
  validationSchema: recoverFormEval,
  initialValues: {
    email: (route.params.email as string) || '',
  },
});

const { value: codeValue, errorMessage: codeError, handleBlur: codeBlur } = useField('code');

const startRecover = handleSubmit(async (values) => {
  // Implement recovery logic here
});
</script>
