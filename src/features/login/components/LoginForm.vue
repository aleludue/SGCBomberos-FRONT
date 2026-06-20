<template>
  <form v-if="!recoverForm" @submit.prevent="onLogin" class="d-flex gap-2 flex-column">
    <FieldEmail :label-text="$t('FormField.Email')" :email="newEmail" field-name="email" />

    <FieldPass
      :label-text="$t('FormField.Pass')"
      :btn-view-pass="true"
      ref="passFieldRef"
      field-name="pass"
    />

    <div class="text-center">
      <a href="#" class="text-decoration-none" @click.prevent="recoverForm = true">
        {{ $t('BaseViews.LoginRecover') }}
      </a>
    </div>

    <BtnConfirm type="submit" size="sm" class="mt-2">
      <i class="bi bi-door-open"></i> {{ $t('Buttons.Login') }}
    </BtnConfirm>

    <BtnConfirm type="button" size="md" class="mt-2" @click="loginFinger">
      <i class="bi bi-fingerprint me-2"></i> {{ $t('Buttons.LoginFinger') }}
    </BtnConfirm>
  </form>

  <RecoverForm v-else @backLogin="recoverForm = !recoverForm" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import { useAuthStore } from '@/shared/stores/auth.store';
import RecoverForm from '@/features/login/components/RecoverForm.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';
import FieldEmail from '@/shared/components/Inputs/FieldEmail.vue';
import FieldPass from '@/shared/components/Inputs/FieldPass.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import { postFingerLogOptions } from '@/features/login/services/login.action';
import { base64UrlToBuffer, bufferToBase64Url } from '@/shared/utils/genericFuntions';

const authStore = useAuthStore();
const router = useRouter();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const recoverForm = ref(false);
const passFieldRef = ref<InstanceType<typeof FieldPass> | null>(null);
const { t } = useI18n();
const toast = useToast();

const props = defineProps<{
  newEmail?: string;
}>();

const { handleSubmit: handleLogin } = useForm();

const onLogin = handleLogin(async ({ email, pass }) => {
  activeSpinner(t('Messages.LoadSession'));
  const result = await authStore.login(email, pass);
  desactivateSpinner();
  if (result) {
    await router.push({ name: 'home' });
    return;
  }
});

const loginFinger = async () => {
  activeSpinner(t('Messages.LoadSession'));

  try {
    const optionsRes = await postFingerLogOptions();

    if (!optionsRes.ok || !optionsRes.data) {
      desactivateSpinner();
      toast.error(t('Messages.Error'));
      return;
    }

    const serverOptions = optionsRes.data;

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: base64UrlToBuffer(serverOptions.challenge),
      timeout: serverOptions.timeout,
      rpId: serverOptions.rpId,
      userVerification: 'required',
      allowCredentials: [],
    };

    const credential = (await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    })) as PublicKeyCredential | null;

    if (!credential) {
      desactivateSpinner();
      toast.error(t('Messages.Error'));
      return;
    }

    const assertion = credential.response as AuthenticatorAssertionResponse;

    const commandVerify = {
      clientResponse: {
        id: credential.id,
        rawId: bufferToBase64Url(credential.rawId),
        type: credential.type as 'public-key',
        response: {
          clientDataJSON: bufferToBase64Url(assertion.clientDataJSON),
          authenticatorData: bufferToBase64Url(assertion.authenticatorData),
          signature: bufferToBase64Url(assertion.signature),
          userHandle: assertion.userHandle ? bufferToBase64Url(assertion.userHandle) : undefined,
        },
      },
    };

    const result = await authStore.loginFinger(commandVerify);
    desactivateSpinner();
    if (result) {
      await router.push({ name: 'home' });
      return;
    }
  } catch {
    desactivateSpinner();
    toast.error(t('Messages.Error'));
  }
};

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
