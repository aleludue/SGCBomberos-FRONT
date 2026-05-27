<template>
  <div class="col-12 text-start error-tooltip-wrapper mb-1">
    <label :for="uuid" class="form-label small fw-bold text-secondary-themed mb-1">
      {{ labelText }}
    </label>

    <div class="tactical-pass-container" :class="{ 'is-invalid-group': passError }">
      <input
        :id="uuid"
        v-model="passValue"
        v-bind="$attrs"
        :type="showPassword ? 'text' : 'password'"
        class="tactical-input-pass"
        :autocomplete="btnViewPass ? 'current-password' : 'new-password'"
        :placeholder="placeholdText"
        @blur="passBlur"
        :aria-invalid="!!passError"
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

    <span v-if="passError" class="error-tooltip-msg d-block mt-1" role="alert">
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
  const schema = string().required().min(props.minLength);
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

.tactical-pass-container {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  background-color: #2e3545 !important;
  border: 1px solid #3d4659 !important;
  border-radius: 6px !important;
  overflow: hidden;
  width: 100%;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.tactical-input-pass {
  flex: 1 !important;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  color: #ffffff !important;
  padding: 0.75rem 1rem !important;
  font-size: 0.9rem;
  box-shadow: none !important;
}

.btn-view-pass-trigger {
  background: transparent !important;
  border: none !important;
  color: #94a3b8 !important;
  padding: 0 1.25rem !important;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none !important;
  transition: color 0.2s ease;
}

.btn-view-pass-trigger:hover {
  color: #ffffff !important;
}

.tactical-pass-container:focus-within {
  border-color: #ff6b00 !important;
  box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.2) !important;
}

.tactical-pass-container.is-invalid-group {
  border-color: #dc3545 !important;
}
</style>
