<template>
  <h2 class="text-center">{{ $t('LoginView.Title') }}</h2>

  <form @submit.prevent="onLogin" class="mt-2">
    <div class="mb-3">
      <label class="form-label" for="email">{{ $t('LoginView.EmailTitle') }}</label>
      <input
        v-model="myForm.email"
        ref="emailInputRef"
        type="text"
        id="email"
        name="email"
        class="form-control"
        autocomplete="off"
        placeholder="{{ $t('LoginView.EmailPlaceholder') }}"
      />
    </div>

    <div class="mb-2">
      <label for="password" class="form-label">{{ $t('LoginView.PassTitle') }}</label>
      <input
        v-model="myForm.password"
        ref="passwordInputRef"
        type="password"
        id="password"
        name="password"
        class="form-control"
        autocomplete="off"
        placeholder="{{ $t('LoginView.PassPlaceholder') }}"
      />
    </div>
    <div class="mb-3 text-blue-500">
      <a href="#" class="hover:underline">{{ $t('LoginView.RecoverPassLink') }}</a>
    </div>
    <div class="text-center">
      <button type="submit" class="btn btn-outline-primary">{{ $t('LoginView.BtnLogin') }}</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useRouter } from 'vue-router';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import { isMobile } from '../utils/genericFuntions';

const authStore = useAuthStore();
const settingStore = useSiteConfigStore();
const router = useRouter();

const emailInputRef = ref<HTMLInputElement | null>(null);
const passwordInputRef = ref<HTMLInputElement | null>(null);

const myForm = reactive({
  email: '',
  password: '',
});

const onLogin = async () => {
  if (myForm.email === '') {
    return emailInputRef.value?.focus();
  }

  if (myForm.password.length < 6) {
    return passwordInputRef.value?.focus();
  }

  settingStore.activeSpinner('Iniciando sesión...');
  const ok = await authStore.login(myForm.email, myForm.password);
  settingStore.deactivateSpinner();

  if (ok) return router.replace('/');
};
</script>
