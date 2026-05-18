<template>
  <div class="col-12 text-start error-tooltip-wrapper mb-1">
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
    </label>

    <div class="position-relative tactical-pass-container">
      <input
        :id="uuid"
        v-model="passValue"
        v-bind="$attrs"
        :type="showPassword ? 'text' : 'password'"
        class="form-control tactical-input-pass"
        :class="{
          'is-invalid': passError,
          'pe-5': btnViewPass,
        }"
        autocomplete="off"
        :placeholder="placeholdText"
        @blur="passBlur"
        :aria-invalid="!!passError"
      />

      <button
        v-if="btnViewPass"
        type="button"
        class="btn btn-view-pass-trigger d-flex align-items-center justify-content-center"
        @click="showPassword = !showPassword"
        :title="showPassword ? 'Ocultar' : 'Mostrar'"
      >
        <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi bi-eye'"></i>
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
  let schema = string().required().min(props.minLength);
  if (props.isConfirmField) {
    return schema.test(
      'match-pass',
      t('Validations.PasswordMismatch'),
      (value) => value === originPass.value,
    );
  }
  return schema;
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
  color: #94a3b8 !important;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.tactical-input-pass {
  padding: 0.75rem 1rem !important;
  font-size: 0.9rem;
  border-radius: 8px !important;
  width: 100%;
}

.tactical-input-pass:focus {
  border-color: #ff6b00 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.2) !important;
}

.btn-view-pass-trigger {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: transparent !important;
  border: none !important;
  color: #94a3b8 !important;
  padding: 4px !important;
  z-index: 5;
  transition: color 0.2s ease;
}

.btn-view-pass-trigger:hover {
  color: #ffffff !important;
}

:global([data-bs-theme='light']) .btn-view-pass-trigger {
  color: var(--bs-secondary-color) !important;
}
:global([data-bs-theme='light']) .btn-view-pass-trigger:hover {
  color: var(--bs-body-color) !important;
}
</style>
