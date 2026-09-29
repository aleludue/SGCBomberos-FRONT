<template>
  <div class="accordion-item bg-transparent text-body border-0 border-top border-secondary-subtle">
    <h2 class="accordion-header">
      <button
        class="accordion-button collapsed fw-bold text-body bg-transparent py-3 px-4"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapsePass"
        aria-expanded="false"
        aria-controls="collapsePass"
      >
        <i class="bi bi-translate text-orange-fire me-2"></i> {{ $t('FormField.Pass') }}
      </button>
    </h2>
    <div id="collapsePass" class="accordion-collapse collapse" data-bs-parent="#accordionSettings">
      <div class="accordion-body border-top border-secondary-subtle bg-body">
        <form @submit.prevent="configUpdPass" class="d-flex gap-2 flex-column">
          <FieldPass
            ref="oldPassRef"
            :label-text="$t('FormField.PassCurrent')"
            :btn-view-pass="false"
            field-name="oldPass"
          />

          <FieldPass
            ref="passRef"
            :label-text="$t('FormField.PassNew')"
            :btn-view-pass="false"
            field-name="pass"
          />

          <FieldPass
            ref="passConfirmRef"
            v-model:origin-pass="values.pass"
            :label-text="$t('FormField.PassNewConfirm')"
            :btn-view-pass="false"
            :is-confirm-field="true"
            field-name="confirmPass"
          />

          <BtnConfirm type="submit" class="mt-2" :text-detail="$t('Buttons.Update')" />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

import BtnConfirm from '@/shared/components/Button/BtnConfirm.vue';
import FieldPass from '@/shared/components/Inputs/FieldPass.vue';
import { useSiteConfigStore } from '@/shared/stores/config.store';

import { updatePass } from '@/features/account/services';

const { handleSubmit, values, resetForm } = useForm();
const { activeSpinner, desactivateSpinner } = useSiteConfigStore();
const toast = useToast();
const { t } = useI18n();

const oldPassRef = ref<InstanceType<typeof FieldPass> | null>(null);
const passRef = ref<InstanceType<typeof FieldPass> | null>(null);
const passConfirmRef = ref<InstanceType<typeof FieldPass> | null>(null);

const configUpdPass = handleSubmit(async (vals) => {
  activeSpinner(t('Messages.Update'));

  const { ok, message } = await updatePass(vals.oldPass, vals.pass, vals.confirmPass);

  if (ok) {
    toast.success(t('Messages.SuccessRegister'));

    resetForm();
    oldPassRef.value?.resetPassField?.();
    passRef.value?.resetPassField?.();
    passConfirmRef.value?.resetPassField?.();
  } else {
    toast.error(message || t('Messages.ErrorUpdate'));
  }

  desactivateSpinner();
});
</script>
