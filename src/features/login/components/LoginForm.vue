<template>
  <form @submit.prevent="onLogin" class="mt-2 d-flex gap-3 flex-column" v-if="!recoverForm">
    <FieldEmail
      :label-text="$t('LoginView.EmailTitle')"
      :email="props.newEmail"
      field-name="email"
    />

    <FieldPass
      :label-text="$t('LoginView.PassTitle')"
      :btn-view-pass="true"
      ref="passFieldRef"
      field-name="pass"
    />

    <div class="text-center text-blue-500">
      <a href="#" class="hover:underline" @click="recoverForm = !recoverForm">
        {{ $t('LoginView.RecoverPassLink') }}
      </a>
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

import { useAuthStore } from '@/shared/stores/auth.store';
import RecoverForm from '@/features/login/components/RecoverForm.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import FieldEmail from '@/shared/components/Inputs/FieldEmail.vue';
import FieldPass from '@/shared/components/Inputs/FieldPass.vue';

const authStore = useAuthStore();
const settingStore = useSiteConfigStore();
const recoverForm = ref(false);

const props = defineProps<{
  newEmail?: string;
}>();

const { handleSubmit: handleLogin } = useForm();

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
      const passFieldRef = ref<InstanceType<typeof FieldPass> | null>(null);
      passFieldRef.value?.resetPassField();
    }
  },
  { immediate: true },
);
</script>
