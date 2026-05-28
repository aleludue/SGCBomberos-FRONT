<template>
  <div class="col-12 text-start error-tooltip-wrapper mb-1">
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
    </label>

    <div class="tactical-pass-container">
      <input
        :id="uuid"
        v-model="passValue"
        v-bind="$attrs"
        :type="showPassword ? 'text' : 'password'"
        :autocomplete="btnViewPass ? 'current-password' : 'new-password'"
        :placeholder="placeholdText"
        @blur="passBlur"
        class="form-control tactical-input-pass"
        :class="{ 'is-invalid': passError }"
      />

      <button
        v-if="btnViewPass"
        type="button"
        class="btn-view-pass-trigger"
        @click="showPassword = !showPassword"
        :title="showPassword ? 'Ocultar' : 'Mostrar'"
      >
        <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
      </button>
    </div>

    <span v-if="passError" class="error-tooltip-msg" role="alert">
      {{ passError }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed, ref, useId, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { string } from 'yup';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  labelText: { type: String, default: '' },
  fieldName: { type: String, default: 'passwordField' },
  btnViewPass: { type: Boolean, default: false },
  minLength: { type: Number, default: 8 },
  placeholdText: { type: String, default: '--------' },
  isConfirmField: { type: Boolean, default: false },
});

const { t } = useI18n();
const uuid = useId();
const showPassword = ref(false);

defineModel<string>('passVal');
const originPass = defineModel<string>('originPass');

const passSchema = computed(() => {
  if (props.isConfirmField) {
    return string()
      .required()
      .test('match-pass', t('Validations.PasswordMismatch'), (value) => value === originPass.value);
  }

  return string()
    .required()
    .min(props.minLength)
    .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula.')
    .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula.')
    .matches(/[0-9]/, 'La contraseña debe contener al menos un número.')
    .matches(
      /[^a-zA-Z0-9]/,
      'La contraseña debe contener al menos un carácter especial (ej: !, @, #, $, etc.).',
    );
});

const {
  value: passValue,
  errorMessage: passError,
  handleBlur: passBlur,
  validate: validateField,
  resetField: resetPassField,
} = useField(props.fieldName, passSchema, { syncVModel: 'passVal' });

if (props.isConfirmField) {
  watch(
    () => originPass.value,
    () => {
      if (passValue.value) validateField();
    },
  );
}

defineExpose({
  resetPassField,
});
</script>

<style scoped>
.text-secondary-themed {
  color: var(--bs-secondary-color, #94a3b8) !important;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.tactical-pass-container {
  display: flex !important;
  flex-direction: row !important;
  align-items: stretch !important;
  border-radius: 8px !important;
  overflow: hidden;
  width: 100%;
  background-color: transparent !important;
}

.tactical-input-pass {
  flex: 1 !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-right: none !important;
  background-color: #2b3035 !important;
  border: 1px solid #495057 !important;
  color: #f8f9fa !important;
  padding: 0.75rem 1rem !important;
  font-size: 0.9rem;
}

.btn-view-pass-trigger {
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border: 1px solid #495057 !important;
  border-left: none !important;
  background-color: #2b3035 !important;
  color: #adb5bd !important;
  padding: 0 1.25rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none !important;
  transition: all 0.2s ease;
}

.btn-view-pass-trigger:hover {
  color: #ffffff !important;
}

:global([data-bs-theme='light']) .tactical-input-pass,
[data-bs-theme='light'] .tactical-input-pass {
  background-color: #f1f5f9 !important;
  border: 1px solid #cbd5e1 !important;
  border-right: none !important;
  color: #333a48 !important;
}

:global([data-bs-theme='light']) button.btn-view-pass-trigger,
:global([data-bs-theme='light']) .tactical-pass-container button,
[data-bs-theme='light'] .btn-view-pass-trigger,
button.btn-view-pass-trigger[type='button'] {
  background-color: #f1f5f9 !important;
  border: 1px solid #cbd5e1 !important;
  border-left: none !important;
  color: #64748b !important;
}

:global([data-bs-theme='light']) button.btn-view-pass-trigger:hover,
[data-bs-theme='light'] .btn-view-pass-trigger:hover {
  color: #333a48 !important;
  background-color: #e2e8f0 !important;
}

.tactical-input-pass:focus {
  border-color: #ff6b00 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.2) !important;
}

.tactical-input-pass:focus + .btn-view-pass-trigger {
  border-top-color: #ff6b00 !important;
  border-bottom-color: #ff6b00 !important;
  border-right-color: #ff6b00 !important;
}
</style>
