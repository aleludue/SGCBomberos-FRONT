<template>
  <form @submit.prevent="onLogin" class="mt-2" v-if="!recoverForm">
    <EmailField :label-text="$t('LoginView.EmailTitle')" :email="props.newEmail" />

    <PassField :label-text="$t('LoginView.PassTitle')" :btn-view-pass="true" ref="passFieldRef" />

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
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { useAuthStore } from '@/shared/stores/auth.store';
import RecoverForm from '@/features/login/components/RecoverForm.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import EmailField from '@/features/login/components/EmailField.vue';
import PassField from '@/features/login/components/PassField.vue';

const authStore = useAuthStore();
const settingStore = useSiteConfigStore();
const recoverForm = ref(false);

const props = defineProps<{
  newEmail?: string;
}>();

const logFormEval = yup.object({
  email: yup.string().required().email(),
  pass: yup.string().required().min(8),
});

const { handleSubmit: handleLogin } = useForm({
  validationSchema: logFormEval,
});

const onLogin = handleLogin(async (values) => {
  settingStore.activeSpinner('Iniciando sesión...');
  const result = await authStore.login(values.email, values.pass);
  settingStore.deactivateSpinner();
  if (result) return;
});

watch(
  () => props.newEmail,
  (newVal) => {
    if (newVal) {
      const passFieldRef = ref<InstanceType<typeof PassField> | null>(null);
      passFieldRef.value?.resetPassField();
    }
  },
  { immediate: true },
);
</script>
