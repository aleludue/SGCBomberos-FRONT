<template>
  <div class="container p-3">
    <div class="col-11 p-4 pt-3 rounded shadow bg-body" style="max-width: 400px; margin: auto">
      <TitleLogoForm />

      <div class="col-12">
        <h3 class="mb-3 text-center">{{ $t('RecoverView.Title') }}</h3>

        <form @submit.prevent="startRecover" class="mt-2 d-flex gap-3 flex-column">
          <FieldEmail :label-text="$t('LoginView.EmailTitle')" field-name="email" />

          <FieldText
            :label-text="$t('RecoverView.CodeTitle')"
            :is-login-form="true"
            :is-required="true"
            :is-alfa-oblig="true"
            :length="8"
            field-name="code"
          />

          <FieldPass
            :label-text="$t('RecoverView.NewPassTitle')"
            :btn-view-pass="false"
            field-name="pass"
          />

          <FieldPass
            v-model:origin-pass="values.pass"
            :label-text="$t('RecoverView.ConfirmNewPassTitle')"
            :btn-view-pass="false"
            :is-confirm-field="true"
            field-name="confirmPass"
          />

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
import { useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import FieldEmail from '@/shared/components/Inputs/FieldEmail.vue';
import TitleLogoForm from '@/features/login/components/TitleLogoForm.vue';
import FieldPass from '@/shared/components/Inputs/FieldPass.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { passChangeAction } from '@/features/login/services';
import FieldText from '@/shared/components/Inputs/FieldText.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { activeSpinner, deactivateSpinner } = useSiteConfigStore();

const { handleSubmit, values } = useForm({
  initialValues: {
    email: (route.params.email as string) || '',
    code: '',
    pass: '',
    confirmPass: '',
  },
});

const startRecover = handleSubmit(async ({ email, code, pass, confirmPass }) => {
  activeSpinner('Actualizando usuario...');

  const { ok, message } = await passChangeAction(email, code, pass, confirmPass);

  if (!ok) {
    toast.error(message);
  } else {
    toast.success(message);
    router.push({ name: 'login' });
  }

  deactivateSpinner();
});
</script>
