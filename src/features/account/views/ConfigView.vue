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
              <i class="bi bi-fingerprint text-orange-fire me-2"></i>
              {{ $t('FormField.FingerPrint') }}
              <span
                class="badge rounded-pill bg-secondary ms-2 small"
                v-if="fingerPrintReg.length > 0"
              >
                {{ fingerPrintReg.length }}
              </span>
            </button>
          </h2>
          <div
            id="collapseFingerprint"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionSettings"
          >
            <div
              v-if="fingerPrintReg.length === 0"
              class="d-flex align-items-center justify-content-between py-3 px-4"
            >
              <div>
                <span class="small d-block mb-1">{{ $t('BaseViews.DeviceStatus') }}</span>
                <span
                  class="badge px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 bg-warning text-dark fw-bold border border-warning"
                >
                  <i class="bi bi-exclamation-triangle-fill me-1"></i>
                  {{ $t('BaseViews.FingerprintNotRegistered') }}
                </span>
              </div>
              <button
                class="btn btn-sm btn-action-edit px-3 fw-medium transition-all"
                @click="addFingerprint"
              >
                <i class="bi bi-plus-lg me-1"></i>
                {{ $t('Buttons.Add') }}
              </button>
            </div>
            <div v-else>
              <div
                class="d-flex justify-content-between align-items-center py-2 px-4 border-bottom bg-light-subtle"
              >
                <span class="small text-muted fw-medium">
                  {{ $t('BaseViews.FingerprintRegistered') }}
                </span>
                <button
                  class="btn btn-sm btn-link text-decoration-none p-0 fw-semibold text-orange-fire"
                  @click="addFingerprint"
                >
                  <i class="bi bi-plus-lg me-1"></i>{{ $t('Buttons.Add') }}
                </button>
              </div>

              <div
                v-for="device in fingerPrintReg"
                :key="device.id"
                class="d-flex align-items-center justify-content-between py-3 px-4 border-bottom last-border-0"
              >
                <div class="d-flex align-items-center gap-3">
                  <div
                    class="bg-success-subtle border border-success-subtle text-success p-2 rounded"
                  >
                    <i class="bi bi-shield-lock-fill lh-1 d-block fs-5"></i>
                  </div>
                  <div>
                    <span class="fw-semibold d-block mb-0.5">{{ device.deviceName }}</span>
                    <span class="text-muted small">
                      Reg: {{ new Date(device.createdAt).toLocaleDateString() }}
                    </span>
                  </div>
                </div>

                <button
                  class="btn btn-sm btn-outline-danger px-3 fw-medium transition-all"
                  @click="idToDelete = device.id"
                  data-bs-toggle="modal"
                  data-bs-target="#validActionModal"
                >
                  <i class="bi bi-trash3 me-1"></i>
                  {{ $t('Buttons.Delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex mt-3 mb-0 w-100 btn-responsive-wrapper">
        <BtnConfirm size="sm" :text-detail="$t('Buttons.Save')" @click="saveConfigs()" />
      </div>

      <BtnBack :toHome="true" />
    </div>

    <ModalValidAction
      :titleText="$t('BaseViews.FingerprintDeleteTitle')"
      :bodyText="$t('BaseViews.FingerprintDeleteMessage')"
      @confirm="deleteFingerprint"
    />

    <div
      class="modal fade"
      id="fingerDeviceModal"
      ref="deviceModalRef"
      tabindex="-1"
      aria-hidden="true"
      aria-labelledby="fingerDeviceModalTitle"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div
          class="modal-content border border-secondary-subtle shadow-lg bg-body-tertiary custom-modal-tactical"
        >
          <div class="modal-header border-bottom border-secondary-subtle py-3 px-4">
            <h1
              id="fingerDeviceModalTitle"
              class="modal-title fs-5 fw-bold text-body d-flex align-items-center gap-2"
            >
              <i class="bi bi-fingerprint text-orange-fire"></i>
              {{ $t('FormField.FingerPrint') }}
            </h1>
            <button
              type="button"
              class="btn-close btn-close-themed"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="cancelDeviceModal"
            ></button>
          </div>

          <div class="modal-body py-3 px-4 text-body">
            <form class="row g-3" @submit.prevent="confirmDeviceModal">
              <div class="col-12">
                <FieldText
                  :label-text="$t('BaseViews.FingerprintDeviceName')"
                  :placeholdText="$t('BaseViews.FingerprintDevicePlaceHolder')"
                  field-name="modalDeviceName"
                  :is-required="true"
                  :max-length="100"
                  v-model:text-det="deviceNameModel"
                  :is-login-form="true"
                />
              </div>
            </form>
          </div>

          <div
            class="modal-footer border-top border-secondary-subtle py-3 px-4 d-flex justify-content-end gap-2"
          >
            <div class="d-flex gap-2">
              <button
                id="closeModalDevice"
                type="button"
                class="btn btn-sm btn-cancel-link py-1 px-3"
                data-bs-dismiss="modal"
                @click="cancelDeviceModal"
              >
                {{ $t('Buttons.Close') }}
              </button>

              <BtnConfirm
                type="button"
                size="sm"
                class="px-4 fw-bold shadow-sm"
                @click="confirmDeviceModal"
              >
                <i class="bi bi-check-circle me-1"></i>
                {{ $t('Buttons.Save') }}
              </BtnConfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { Modal } from 'bootstrap';

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
import type { FingerprintList } from '@/features/account/interfaces/user.interface';
import ModalValidAction from '@/shared/components/ModalValidAction.vue';
import FieldText from '@/shared/components/Inputs/FieldText.vue';

const configStore = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();

const selectMode = ref(configStore.configs.siteColorMode);
const selectLanguage = ref(configStore.configs.siteLanguage);
const fingerPrintReg = ref<FingerprintList[]>([]);
const deviceNameModel = ref('');
const deviceModalRef = ref(null);
const idToDelete = ref(0);

let bootstrapModalInstance: Modal | null = null;
let resolveModal: ((value: string) => void) | null = null;
let rejectModal: ((reason: Error) => void) | null = null;

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
  await loadSettings();
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

const loadSettings = async () => {
  const { ok, message, data } = await getSettingAction();

  if (ok) {
    selectMode.value = configStore.configs.siteColorMode;
    selectLanguage.value = configStore.configs.siteLanguage;
    fingerPrintReg.value = data?.fingerprints || [];
  } else {
    toast.error(message || t('Messages.ErrorLoading'));
  }
};

const addFingerprint = async () => {
  try {
    configStore.activeSpinner(t('Messages.Update'));

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

    configStore.desactivateSpinner();
    const finalDeviceName = await requestDeviceNameFromUser();
    configStore.activeSpinner(t('Messages.Update'));

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
      deviceName: finalDeviceName as string,
    };

    const respVerify = await postFingerRegVerify(commandVerify);

    if (!respVerify.ok) {
      toast.error(respVerify.message || t('Messages.ErrorUpdate'));
      return;
    }

    await loadSettings();

    toast.success(t('Messages.SuccessUpdate'));
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.name === 'NotAllowedError' ||
        error.message === 'Registro cancelado por el usuario'
      ) {
        toast.error(t('Messages.ActionCanceled'));
      } else if (
        error.name === 'InvalidStateError' ||
        error.message.includes('already exists') ||
        error.message.includes('ya existe')
      ) {
        toast.error(t('BaseViews.FingerprintExistMessage'));
      } else {
        toast.error(t('Messages.ErrorUpdate'));
      }
    } else {
      toast.error(t('Messages.ErrorUpdate'));
    }
  } finally {
    configStore.desactivateSpinner();
  }
};

const deleteFingerprint = async () => {
  if (idToDelete.value == 0) {
    toast.error(t('Messages.ErrorUpdate'));
    return;
  }

  configStore.activeSpinner(t('Messages.Update'));
  const { ok, message } = await deleteFingerReg(idToDelete.value);

  idToDelete.value = 0;

  if (!ok) {
    toast.error(message || t('Messages.ErrorUpdate'));
    return;
  }

  await loadSettings();

  toast.success(t('Messages.SuccessUpdate'));
  configStore.desactivateSpinner();
};

const requestDeviceNameFromUser = () => {
  if (!bootstrapModalInstance && deviceModalRef.value) {
    bootstrapModalInstance = new Modal(deviceModalRef.value, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  deviceNameModel.value = '';
  bootstrapModalInstance!.show();

  return new Promise((resolve, reject) => {
    resolveModal = resolve;
    rejectModal = reject;
  });
};

const confirmDeviceModal = () => {
  const name = deviceNameModel.value.trim();
  if (!name) return;

  bootstrapModalInstance!.hide();
  if (resolveModal) resolveModal(name);
};

const cancelDeviceModal = () => {
  bootstrapModalInstance!.hide();
  if (rejectModal) toast.error(t('Messages.ActionCanceled'));
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
