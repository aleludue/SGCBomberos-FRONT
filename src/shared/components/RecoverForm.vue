<template>
  <Form @submit="recoverAccount" class="mt-2" :validation-schema="valRecover" v-slot="{ errors }">
    <div class="mb-3 form-floating">
      <Field
        v-model="formRec.email"
        type="text"
        id="emailRec"
        name="emailRec"
        class="form-control"
        autocomplete="off"
        placeholder=""
        :class="{ 'border-danger is-invalid': errors.emailRec }"
      />
      <label for="emailRec">{{ $t('LoginView.EmailTitle') }}</label>
      <ErrorMessage name="emailRec" class="text-danger"></ErrorMessage>
    </div>

    <div class="mb-3 form-floating">
      <Field
        v-model="formRec.intNum"
        type="text"
        id="intNumRec"
        name="intNumRec"
        class="form-control"
        autocomplete="off"
        placeholder=""
        :class="{ 'border-danger is-invalid': errors.intNumRec }"
      />
      <label for="intNumRec">{{ $t('LoginView.InternalNumRecover') }}</label>
      <ErrorMessage name="intNumRec" class="text-danger"></ErrorMessage>
    </div>

    <div class="mb-2 text-center">
      <button type="submit" class="btn btn-outline-primary me-3">
        <i class="bi bi-envelope-arrow-up-fill"></i>
        {{ $t('LoginView.BtnRecover') }}
      </button>

      <button class="btn btn-outline-secondary" @click="emit('backLogin', false)">
        <i class="bi bi-x-circle"></i>
        {{ $t('GenericBtn.BtnCancel') }}
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useRouter } from 'vue-router';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { number, object, string } from 'yup';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const authStore = useAuthStore();
const settingStore = useSiteConfigStore();
const router = useRouter();

const emit = defineEmits(['backLogin']);

const valRecover = object({
  emailRec: string().required().email(),
  intNumRec: number().typeError(t('ValidationMsg.NumType')).required().min(1).integer(),
});

const formRec = reactive({
  email: '',
  intNum: '',
});

const recoverAccount = async () => {
  //ver que hacer
};
</script>
