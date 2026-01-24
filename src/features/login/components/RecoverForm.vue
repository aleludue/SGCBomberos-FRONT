<template>
  <form @submit.prevent="recoverAccount" class="mt-2">
    <div class="mb-3 form-floating">
      <input
        v-model="emailRecValue"
        type="text"
        class="form-control"
        autocomplete="off"
        placeholder=""
        @blur="emailRecBlur"
        :class="{ 'border-danger is-invalid': emailRecError }"
      />
      <label for="emailRec">{{ $t('LoginView.EmailTitle') }}</label>
      <span v-if="emailRecError" class="text-danger">{{ emailRecError }}</span>
    </div>

    <div class="mb-3 form-floating">
      <input
        v-model="intNumValue"
        type="text"
        class="form-control"
        autocomplete="off"
        placeholder=""
        @blur="intNumBlur"
        :class="{ 'border-danger is-invalid': intNumError }"
      />
      <label for="intNumRec">{{ $t('LoginView.InternalNumRecover') }}</label>
      <span v-if="intNumError" class="text-danger">{{ intNumError }}</span>
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
  </form>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { number, object, string } from 'yup';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const emit = defineEmits(['backLogin']);

const valRecover = object({
  emailRec: string().required().email(),
  intNumRec: number().typeError(t('ValidationMsg.NumType')).required().min(1).integer(),
});

const { handleSubmit } = useForm({
  validationSchema: valRecover,
});

const {
  value: emailRecValue,
  errorMessage: emailRecError,
  handleBlur: emailRecBlur,
} = useField('emailRec');

const {
  value: intNumValue,
  errorMessage: intNumError,
  handleBlur: intNumBlur,
} = useField('intNumRec');

const recoverAccount = handleSubmit(async (values) => {
  //ver que hacer
});
</script>
