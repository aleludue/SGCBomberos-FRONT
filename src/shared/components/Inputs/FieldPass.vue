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
  color: var(--bs-secondary-color) !important;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.tactical-pass-container {
  display: flex !important;
  flex-direction: row !important;
  align-items: stretch !important;
  border-radius: 8px !important;
  width: 100%;
  background-color: var(--bs-tertiary-bg) !important;
  border: 1px solid var(--bs-border-color) !important;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.tactical-input-pass {
  flex: 1 !important;
  border: none !important;
  background-color: transparent !important;
  color: var(--bs-body-color) !important;
  padding: 0.75rem 1rem !important;
  font-size: 0.9rem;
  outline: none !important;
  box-shadow: none !important;
}

.btn-view-pass-trigger {
  border: none !important;
  background-color: transparent !important;
  color: var(--bs-secondary-color) !important;
  padding: 0 1.1rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none !important;
  transition:
    color 0.2s ease,
    opacity 0.2s ease;
  opacity: 0.7;
}

.btn-view-pass-trigger i {
  font-size: 1.05rem;
}

.btn-view-pass-trigger:hover {
  color: #ff6b00 !important;
  opacity: 1;
}

.tactical-pass-container:focus-within {
  border-color: #ff6b00 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.2) !important;
}

.tactical-input-pass:focus + .btn-view-pass-trigger {
  border-top-color: #ff6b00 !important;
  border-bottom-color: #ff6b00 !important;
  border-right-color: #ff6b00 !important;
}
</style>
