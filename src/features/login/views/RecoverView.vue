<template>
  <title>{{ $t('RecoverView.ViewTitle') }}</title>

  <div class="container p-3">
    <div class="col-11 p-4 pt-3 rounded shadow bg-body" style="max-width: 400px; margin: auto">
      <TitleLogoForm />

      <div class="col-12">
        <h3 class="mb-3 text-center">{{ $t('RecoverView.Title') }}</h3>
        <form @submit.prevent="startRecover" class="mt-2 d-flex gap-3 flex-column">
          <FieldEmail :label-text="$t('LoginView.EmailTitle')" :field-name="'email'" />

          <div class="form-floating">
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
            <span v-if="codeError" class="invalid-feedback">{{ codeError }}</span>
          </div>

          <FieldPass
            :label-text="$t('RecoverView.NewPassTitle')"
            :btn-view-pass="false"
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
              $t('RecoverView.ConfirmNewPassTitle')
            }}</label>
            <span v-if="confirmPassError" class="invalid-feedback">{{ confirmPassError }}</span>
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
import * as yup from 'yup';
import { useToast } from 'vue-toastification';

import FieldEmail from '@/shared/components/Inputs/FieldEmail.vue';
import TitleLogoForm from '@/features/login/components/TitleLogoForm.vue';
import FieldPass from '@/shared/components/Inputs/FieldPass.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { passChangeAction } from '@/features/login/services';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const settingStore = useSiteConfigStore();

const { handleSubmit } = useForm({
  initialValues: {
    email: (route.params.email as string) || '',
    code: '',
    pass: '',
    confirmPass: '',
  },
});

const {
  value: confirmPassValue,
  errorMessage: confirmPassError,
  handleBlur: confirmPassBlur,
} = useField(
  'confirmPass',
  yup
    .string()
    .required()
    .min(8)
    .oneOf([yup.ref('pass')], t('ValidationMsg.PasswordMismatch')),
);

const {
  value: codeValue,
  errorMessage: codeError,
  handleBlur: codeBlur,
} = useField(
  'code',
  yup
    .string()
    .required()
    .length(8)
    .matches(/^[a-zA-Z0-9]+$/, t('ValidationMsg.MatchAlphanumeric')),
);

const startRecover = handleSubmit(async (values) => {
  settingStore.activeSpinner('Actualizando usuario...');

  try {
    const resp = await passChangeAction(values.email, values.code, values.pass, values.confirmPass);

    if (!resp.ok) {
      toast.error(resp.message);
    } else {
      toast.success(t('RecoverView.SuccessMsg'));
      router.push({ name: 'login' });
    }
  } catch (error) {
    toast.error((error as Error).message);
  }

  settingStore.deactivateSpinner();
});
</script>
