<template>
  <!-- Formulario de Login -->
  <form v-if="!recoverForm" @submit.prevent="onLogin" class="mt-2 d-flex gap-3 flex-column">
    <FieldEmail :label-text="$t('LoginView.EmailTitle')" :email="newEmail" field-name="email" />

    <FieldPass
      :label-text="$t('LoginView.PassTitle')"
      :btn-view-pass="true"
      ref="passFieldRef"
      field-name="pass"
    />

    <div class="text-center">
      <a href="#" class="text-decoration-none" @click.prevent="recoverForm = true">
        {{ $t('LoginView.RecoverPassLink') }}
      </a>
    </div>

    <div class="text-center">
      <button type="submit" class="btn btn-outline-primary">
        <i class="bi bi-door-open"></i>
        {{ $t('LoginView.BtnLogin') }}
      </button>
    </div>
  </form>

  <!-- Formulario de Recuperación -->
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
const { activeSpinner, deactivateSpinner } = useSiteConfigStore();
const recoverForm = ref(false);
const passFieldRef = ref<InstanceType<typeof FieldPass> | null>(null);

const props = defineProps<{
  newEmail?: string;
}>();

const { handleSubmit: handleLogin } = useForm();

const onLogin = handleLogin(async ({ email, pass }) => {
  activeSpinner('Iniciando sesión...');
  const result = await authStore.login(email, pass);
  deactivateSpinner();
  if (result) return;
});

watch(
  () => props.newEmail,
  (newVal) => {
    if (newVal) {
      passFieldRef.value?.resetPassField?.();
    }
  },
  { immediate: true },
);
</script>
