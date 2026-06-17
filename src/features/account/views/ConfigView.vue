<template>
  <div class="container">
    <SectionTitle
      :title="$t('BaseViews.ConfigTitle')"
      :subtitle="$t('BaseViews.ConfigSubtitle')"
      :breadcrumb="true"
      :breadcrumbDetail="[{ detail: $t('BaseViews.ConfigTitle') }]"
    />

    <div class="settings-card-container">
      <div
        class="accordion accordion-flush rounded border border-secondary-subtle overflow-hidden"
        id="accordionSettings"
      >
        <!-- Sección: Modo de Color -->
        <div class="accordion-item bg-transparent text-body border-0">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed fw-bold text-body bg-transparent py-3 px-4"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseColor"
              aria-expanded="false"
              aria-controls="collapseColor"
            >
              <i class="bi bi-palette text-orange-fire me-2"></i> {{ $t('FormField.ColorMode') }}
            </button>
          </h2>
          <div
            id="collapseColor"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionSettings"
          >
            <div class="accordion-body border-top border-secondary-subtle bg-body">
              <div
                v-for="mode in colorOptions"
                :key="mode.id"
                class="form-check mb-2 p-2 rounded-2 hover-row"
              >
                <input
                  class="form-check-input ms-0"
                  type="radio"
                  name="colorMode"
                  :id="mode.id"
                  :value="mode.value"
                  v-model="selectMode"
                />
                <label
                  class="form-check-label ms-2 cursor-pointer text-body fw-medium"
                  :for="mode.id"
                  >{{ $t(mode.label) }}</label
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Idioma -->
        <div
          class="accordion-item bg-transparent text-body border-0 border-top border-secondary-subtle"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed fw-bold text-body bg-transparent py-3 px-4"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseLang"
              aria-expanded="false"
              aria-controls="collapseLang"
            >
              <i class="bi bi-translate text-orange-fire me-2"></i> {{ $t('FormField.Language') }}
            </button>
          </h2>
          <div
            id="collapseLang"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionSettings"
          >
            <div class="accordion-body border-top border-secondary-subtle bg-body">
              <div
                v-for="lang in langOptions"
                :key="lang.id"
                class="form-check mb-2 p-2 rounded-2 hover-row"
              >
                <input
                  class="form-check-input ms-0"
                  type="radio"
                  name="langMode"
                  :id="lang.id"
                  :value="lang.value"
                  v-model="selectLanguage"
                />
                <label
                  class="form-check-label ms-2 cursor-pointer text-body fw-medium"
                  :for="lang.id"
                  >{{ $t(lang.label) }}</label
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Sección: Huella -->
        <div
          class="accordion-item bg-transparent text-body border-0 border-top border-secondary-subtle"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed fw-bold text-body bg-transparent py-3 px-4"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFingerprint"
              aria-expanded="false"
              aria-controls="collapseFingerprint"
            >
              <i class="bi bi-translate text-orange-fire me-2"></i>
              {{ $t('FormField.FingerPrint') }}
            </button>
          </h2>
          <div
            id="collapseFingerprint"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionSettings"
          >
            <div
              class="accordion-body border-top border-secondary-subtle bg-body d-flex align-items-center justify-content-between py-3 px-4"
            >
              <div>
                <span class="text-secondary small d-block mb-1">{{
                  $t('BaseViews.DeviceStatus')
                }}</span>
                <span
                  class="badge px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5"
                  :class="
                    fingerPrintReg
                      ? 'bg-success-subtle text-success-emphasis border border-success'
                      : 'bg-warning text-dark fw-bold border border-warning'
                  "
                >
                  <i
                    class="bi me-1"
                    :class="
                      fingerPrintReg ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill'
                    "
                  ></i>
                  {{
                    fingerPrintReg
                      ? $t('BaseViews.FingerprintRegistered')
                      : $t('BaseViews.FingerprintNotRegistered')
                  }}
                </span>
              </div>

              <button
                class="btn btn-sm px-3 fw-medium transition-all"
                :class="fingerPrintReg ? 'btn-outline-danger' : 'btn-action-status'"
                @click="editFingerprint"
              >
                <i :class="fingerPrintReg ? 'bi bi-trash3 me-1' : 'bi bi-plus-lg me-1'"></i>
                {{ fingerPrintReg ? $t('Buttons.Delete') : $t('Buttons.Add') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex mt-3 mb-0 w-100 btn-responsive-wrapper">
        <BtnConfirm size="sm" class="px-5 py-2 shadow-sm fw-bold" @click="saveConfigs()">
          <i class="bi bi-check-lg me-1"></i> {{ $t('Buttons.Save') }}
        </BtnConfirm>
      </div>

      <BtnBack :toHome="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

import BtnBack from '@/shared/components/Button/BtnBack.vue';
import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import SectionTitle from '@/shared/components/SectionTitle.vue';

import { useSiteConfigStore } from '@/shared/stores/config.store';
import {
  deleteFingerReg,
  getSettingAction,
  postFingerRegOptions,
  postFingerRegVerify,
  saveSettingAction,
} from '@/features/account/services';
import { base64UrlToBuffer, bufferToBase64Url } from '@/shared/utils/genericFuntions';

const configStore = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();

const selectMode = ref(configStore.configs.siteColorMode);
const selectLanguage = ref(configStore.configs.siteLanguage);
const fingerPrintReg = ref(false);

const colorOptions = [
  { id: 'radioDefault', value: 'default', label: 'SelectOptions.ModeDefault' },
  { id: 'radioDark', value: 'dark', label: 'SelectOptions.ModeDark' },
  { id: 'radioLight', value: 'light', label: 'SelectOptions.ModeLight' },
] as const;

const langOptions = [
  { id: 'radioEs', value: 'es', label: 'SelectOptions.Spanish' },
  { id: 'radioEn', value: 'en', label: 'SelectOptions.English' },
] as const;

onMounted(async () => {
  const { ok, message, data } = await getSettingAction();

  if (ok) {
    selectMode.value = configStore.configs.siteColorMode;
    selectLanguage.value = configStore.configs.siteLanguage;
    fingerPrintReg.value = data?.fingerprint || false;
  } else {
    toast.error(message || t('Messages.ErrorLoading'));
  }

  configStore.desactivateSpinner();
});

const saveConfigs = async () => {
  configStore.activeSpinner(t('Messages.Update'));

  const { ok, message } = await saveSettingAction(selectMode.value, selectLanguage.value);

  if (ok) {
    configStore.setUserSettings({
      siteColorMode: selectMode.value,
      siteLanguage: selectLanguage.value,
    });
    toast.success(t('Messages.SuccessUpdate'));
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  configStore.desactivateSpinner();
};

const editFingerprint = async () => {
  configStore.activeSpinner(t('Messages.Update'));

  if (fingerPrintReg.value === true) {
    await deleteFingerprint();
  } else {
    await addFingerprint();
  }

  configStore.desactivateSpinner();
};

const addFingerprint = async () => {
  const { ok, data, message } = await postFingerRegOptions();

  if (!ok || !data) {
    toast.error(message || t('Messages.ErrorUpdate'));
    return;
  }

  const optionsNativas: CredentialCreationOptions = {
    publicKey: {
      rp: {
        id: data.rp.id,
        name: data.rp.name,
      },
      user: {
        id: base64UrlToBuffer(data.user.id),
        name: data.user.name,
        displayName: data.user.displayName,
      },
      challenge: base64UrlToBuffer(data.challenge),
      pubKeyCredParams: data.pubKeyCredParams as PublicKeyCredentialParameters[],
      timeout: data.timeout,
      attestation: data.attestation as AttestationConveyancePreference,
      authenticatorSelection: {
        residentKey: data.authenticatorSelection.residentKey as ResidentKeyRequirement,
        userVerification: data.authenticatorSelection
          .userVerification as UserVerificationRequirement,
      },
      excludeCredentials:
        data.excludeCredentials?.map((credIdStr) => ({
          type: 'public-key',
          id: base64UrlToBuffer(credIdStr),
        })) || [],
    },
  };

  const credential = (await navigator.credentials.create(optionsNativas)) as PublicKeyCredential;

  if (!credential) {
    toast.error(t('Messages.ErrorUpdate'));
    return;
  }

  const attestationResponse = credential.response as AuthenticatorAttestationResponse;

  const commandVerify = {
    id: credential.id,
    rawId: bufferToBase64Url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJson: bufferToBase64Url(attestationResponse.clientDataJSON),
      attestationObject: bufferToBase64Url(attestationResponse.attestationObject),
      transports: attestationResponse.getTransports ? attestationResponse.getTransports() : [],
    },
    extensions: {},
  };

  const respVerify = await postFingerRegVerify(commandVerify);

  if (!respVerify.ok) {
    toast.error(respVerify.message || t('Messages.ErrorUpdate'));
    return;
  }

  fingerPrintReg.value = true;
  toast.success(t('Messages.SuccessUpdate'));
};

const deleteFingerprint = async () => {
  const { ok, message } = await deleteFingerReg();

  if (!ok) {
    toast.error(message || t('Messages.ErrorUpdate'));
    return;
  }

  toast.success(t('Messages.SuccessUpdate'));
  fingerPrintReg.value = false;
};
</script>

<style scoped>
.hover-row {
  transition: background-color 0.2s ease;
}

.hover-row:hover {
  background-color: var(--bs-tertiary-bg) !important;
}

.accordion-button::after {
  filter: var(--bs-accordion-btn-icon-transform, none);
  transition: transform 0.2s ease;
}

.accordion-button:not(.collapsed)::after {
  filter: invert(53%) sepia(93%) saturate(3547%) hue-rotate(11deg) brightness(101%) contrast(106%) !important;
}

.settings-card-container :deep(.form-check-input) {
  cursor: pointer;
}

.transition-all {
  transition: all 0.2s ease-in-out;
}

@media (max-width: 575.98px) {
  .btn-actions-row {
    flex-direction: column-reverse !important;
    gap: 1rem;
    align-items: stretch !important;
  }
  .btn-actions-row button,
  .btn-actions-row :deep(.btn-back-custom) {
    width: 100% !important;
  }
}
</style>
